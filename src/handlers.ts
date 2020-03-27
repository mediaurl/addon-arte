import { WorkerHandlers, MainItem, ChannelItem } from "@watchedcom/sdk";

import { parseItem, parseList } from "./arte-scraper";
const supportedLanguages = ["en", "fr", "de", "es", "pl", "it"];

export const directoryHandler: WorkerHandlers["directory"] = async (
    input,
    ctx
) => {
    const url = "https://www.arte.tv/en/videos/most-viewed/";

    return {
        items: await ctx
            .fetch(url)
            .then((resp) => resp.text())
            .then(parseList)
            .then<ChannelItem[]>((data) =>
                data.map((_) => {
                    return {
                        type: "channel",
                        ids: { id: _.href },
                        name: _.title,
                        images: { poster: _.thumbnailUrl },
                    };
                })
            ),
        nextCursor: null,
    };
};

export const itemHandler: WorkerHandlers["item"] = async (input, ctx) => {
    throw new Error("not implemented");
};
