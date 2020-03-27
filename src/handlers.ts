import { WorkerHandlers } from "@watchedcom/sdk";

const supportedLanguages = ["en", "fr", "de", "es", "pl", "it"];

export const directoryHandler: WorkerHandlers["directory"] = async (
    input,
    ctx
) => {
    return {
        items: [],
        nextCursor: null,
    };
};

export const itemHandler: WorkerHandlers["item"] = async (input, ctx) => {
    throw new Error("not implemented");
};
