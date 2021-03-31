import {
    ActionHandlers,
    ChannelItem,
    DefaultAddonRequest,
} from "@mediaurl/sdk";
import * as querystring from "qs";
import {
    VideoListResponse,
    ListItem,
    StreamResponse,
    SingleItemResponse,
} from "./arte";
import striptags from "striptags";
import { arteAddon } from ".";

const supportedLanguages = ["en", "fr", "de", "es", "pl", "it"];

const detectLanguage = (input: DefaultAddonRequest): string => {
    if (supportedLanguages.indexOf(input.language) !== -1) {
        return input.language;
    }
    return "en";
};

const mapItem = (_: ListItem): ChannelItem => {
    const poster = _.images.landscape.resolutions.pop()?.url;
    return {
        type: "channel",
        ids: { id: _.programId },
        name: [_.title, _.subtitle].filter((_) => _).join(" - "),
        images: { poster },
        description: striptags(_.shortDescription ?? _.teaserText),
    };
};

export const catalogHandler: ActionHandlers["catalog"] = async (input, ctx) => {
    const sort = input.sort || "MOST_VIEWED";
    const page: number = <number>input.cursor || 1;
    const language = detectLanguage(input);
    await ctx.requestCache(
        [input.sort, input.cursor, language, input.region, input.search],
        { ttl: "7d", refreshInterval: "1d" }
    );

    if (input.search) {
        const searchP = ctx
            .fetch(
                `https://www.arte.tv/guide/api/emac/v3/${language}/web/pages/SEARCH/?` +
                    querystring.stringify({
                        mainZonePage: page,
                        query: input.search,
                    })
            )
            .then<SingleItemResponse>((resp) => resp.json());

        return {
            items: (await searchP).zones[0].data.map(mapItem),
            nextCursor: null,
        };
    }

    const url =
        `https://www.arte.tv/guide/api/emac/v3/${language}/web/data/VIDEO_LISTING/?` +
        querystring.stringify({
            imageFormats: "landscape",
            page,
            videoType: sort,
            limit: 20,
        });

    const jsonData = await ctx
        .fetch(url)
        .then<VideoListResponse>((resp) => resp.json());

    return {
        items: jsonData.data.map(mapItem),
        nextCursor: jsonData.data.length ? page + 1 : null,
    };
};

export const itemHandler: ActionHandlers["item"] = async (input, ctx) => {
    await ctx.requestCache([input.ids.id, input.language, input.region], {
        ttl: "7d",
        refreshInterval: "1d",
    });
    const id = input.ids.id;
    const language = detectLanguage(input);

    const itemDataP = ctx
        .fetch(
            `https://www.arte.tv/guide/api/emac/v3/${language}/web/programs/${id}`
        )
        .then<SingleItemResponse>((resp) => resp.json())
        .then((_) => _.zones[0].data.map(mapItem));

    const streamDataP = ctx
        .fetch(
            "https://static-cdn.arte.tv/static/artevp/5.3.3/config/json/general.json"
        )
        .then((resp) => resp.json())
        .then(({ apiplayer: { token } }) => {
            if (!token) {
                throw new Error("Unable to obtain token");
            }

            return ctx.fetch(
                `https://api.arte.tv/api/player/v2/config/${language}/${id}`,
                {
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                }
            );
        })
        .then<StreamResponse>((resp) => resp.json());

    const [streamData, itemData] = await Promise.all([
        streamDataP,
        itemDataP,
    ]).catch(() =>
        Promise.reject(`Unable to parse arte JSON output for ${id}`)
    );

    const firstStreamObj = streamData.data.attributes.streams[0];
    const firstItem = itemData[0];

    if (!firstStreamObj) {
        throw new Error(
            "This video cannot be viewed from your current location"
        );
    }

    return {
        ids: { id },
        type: "channel",
        name: input.name,
        description: firstItem.description,
        sources: [firstStreamObj].map((_) => ({
            type: "url",
            url: `mediaurl-arte:${language}/${id}`,
        })),
    };
};
