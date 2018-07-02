import * as Youtube from 'youtube-api';
import * as Lien from 'lien';
import * as opn from 'opn';
import * as util from 'util'
import { Playlist } from './playlist';
import { PlaylistItem } from './playlistItem';

export class YoutubeClient {
    private server = new Lien({
        host: 'localhost',
        port: '5000'
    });

    public oAuthClient: any;

    private tokensSet = false;

    constructor() {
        
        this.oAuthClient = Youtube.authenticate({
            type: 'oauth',
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            redirect_url: process.env.REDIRECT_URL
        });

        opn(this.oAuthClient.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/youtube']
        }));

        this.server.addPage('/oauth2callback', lien => {
            this.oAuthClient.getToken(lien.query.code, async (err, tokens) => {
                if (tokens) {
                    this.tokensSet = true;
                    this.oAuthClient.setCredentials(tokens);
                    lien.end();
                    const playlistId = await this.insertPlaylist({
                        title: 'TEST PLAYLIST2',
                        description: 'test'
                    });
                    const res = await this.insertVideoToPlaylist({
                        playlistId,
                        videoId: "1qNRvuHli-M"
                    });
                }
            });
        });
    }

    async insertPlaylist(playlist: Playlist): Promise<string> {
        if (!this.tokensSet) {
            throw new Error('You must authorize the Youtube API first.');
        }
        const res = await util.promisify(Youtube.playlists.insert)({
            part: 'snippet,status',
            resource: {
                snippet: {
                    title: playlist.title,
                    description: playlist.description
                },
                status: {
                    privacyStatus: 'private'
                }
            }
        });
        return res.id;
    }

    async insertVideoToPlaylist(playlistItem: PlaylistItem) {
        if (!this.tokensSet) {
            throw new Error('You must authorize the Youtube API first.');
        }
        return util.promisify(Youtube.playlistItems.insert)({
            part: 'snippet',
            resource: {
                snippet: {
                    playlistId: playlistItem.playlistId,
                    resourceId: {
                        kind: "youtube#video",
                        videoId: playlistItem.videoId
                    }
                }
            }
        });
    }
}
