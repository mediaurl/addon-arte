import { createAddon, runCli } from "@mediaurl/sdk";
import { catalogHandler, itemHandler } from "./handlers";

export const arteAddon = createAddon({
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

arteAddon.registerActionHandler("catalog", catalogHandler);

arteAddon.registerActionHandler("item", itemHandler);

runCli([arteAddon], { singleMode: true });
