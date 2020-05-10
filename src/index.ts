import { createWorkerAddon, runCli } from "@watchedcom/sdk";
import { directoryHandler, itemHandler } from "./handlers";

export const arteAddon = createWorkerAddon({
    id: "arte",
    name: "ARTE",
    description: "ARTE, the European culture TV channel",
    version: "0.0.0",
    itemTypes: ["channel"],
    icon: "http://www.arte.tv/favicon.ico",
    defaultDirectoryOptions: {
        imageShape: "landscape",
    },
    defaultDirectoryFeatures: {
        search: {
            enabled: true,
        },
        sort: [
            {
                id: "MOST_VIEWED",
                name: "Trending",
            },
            {
                id: "MOST_RECENT",
                name: "Most recent",
            },
        ],
    },
});

arteAddon.registerActionHandler("directory", directoryHandler);

arteAddon.registerActionHandler("item", itemHandler);

runCli([arteAddon], { singleMode: true });
