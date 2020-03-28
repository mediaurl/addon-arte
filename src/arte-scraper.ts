/**
 * Not used
 */
import * as cheerio from "cheerio";

export interface ArteSingleItem {}

export interface ArteListItem {
    id: string;
    title: string;
    thumbnailUrl: string;
    href: string;
}

/** Can be implemented differently via accessing window.__INITIAL_STATE__ that is set in script tag */
export const parseList = (html: string): ArteListItem[] => {
    const result: ArteListItem[] = [];
    const $ = cheerio.load(html);

    $("div.teasers-list div.next-teaser").each((_, elem) => {
        const href = $(elem).find("a").first().attr("href") as string;
        const id = href.split("/")[3];
        result.push({
            id,
            title: $(elem).find(".next-teaser__caption").text(),
            href,
            thumbnailUrl: `https://api-cdn.arte.tv/api/mami/v1/program/en/${id}/1920x1080`,
        });
    });

    return result;
};

export const parseItem = (html: string): ArteSingleItem => {};
