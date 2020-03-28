export interface VideoListResponse {
    data: ListItem[];
    nextPage: string;
}

export interface ListItem {
    programId: string;
    title: string;
    subtitle: string;
    shortDescription: string;
    teaserText: string;
    images: {
        landscape: {
            resolutions: { url: string }[];
        };
    };
}

export interface SingleItemResponse {
    title: string;
    description: string;
    zones: {
        id: string;
        title: string;
        description: string;
        data: ListItem[];
    }[];
}

export interface StreamResponse {
    data: {
        attributes: {
            streams: {
                url: string;
            }[];
        };
    };
}
