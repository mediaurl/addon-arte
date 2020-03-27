import { createWorkerAddon } from "@watchedcom/sdk";
import { directoryHandler, itemHandler } from "./handlers";

export const arteAddon = createWorkerAddon({
    id: "arte",
    name: "arte",
    description: "ARTE, the European culture TV channel",
    version: "0.0.0",
    itemTypes: ["channel"],
    defaultDirectoryOptions: {
        imageShape: "landscape",
    },
});

arteAddon.registerActionHandler("directory", directoryHandler);

arteAddon.registerActionHandler("item", itemHandler);
