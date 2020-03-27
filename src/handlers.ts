import { WorkerHandlers, ChannelItem } from "@watchedcom/sdk";
import * as querystring from "qs";
import { parseItem, parseList } from "./arte-scraper";

const supportedLanguages = ["en", "fr", "de", "es", "pl", "it"];

export const directoryHandler: WorkerHandlers["directory"] = async (
    input,
    ctx
) => {
    console.log("directory", input);
    const sort = input.sort || "most-viewed";
    const page: number = <number>input.cursor || 1;

    const url =
        `https://www.arte.tv/en/videos/${sort}/?` +
        querystring.stringify({
            page,
        });

    console.log({ url });

    const parsedItems = await ctx
        .fetch(url)
        .then((resp) => resp.text())
        .then(parseList);

    return {
        items: parsedItems.map((_) => {
            return {
                type: "channel",
                ids: { id: _.id },
                name: _.title,
                images: { poster: _.thumbnailUrl },
            };
        }),
        nextCursor: parsedItems.length ? page + 1 : null,
    };
};

export const itemHandler: WorkerHandlers["item"] = async (input, ctx) => {
    console.log("item", input);
    throw new Error("not implemented");
};
