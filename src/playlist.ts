export interface Playlist {
    title: string,
    description: string
}

export interface YoutubePlaylist {
    params: {
        part?: string,
        onBehalfOfContentOwner?: string
    },
    properties: {
        'snippet.title'?: string,
        'snippet.description'?: string,
        'snippet.tags[]'?: string,
        'snippet.defaultLanguage'?: string,
        'status.privacyStatus'?: string
    }
}