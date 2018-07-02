import * as Youtube from 'youtube-api';
import * as Lien from 'lien';
import * as dotenv from 'dotenv';
import * as opn from 'opn';

class YoutubeClient {
    private server = new Lien({
        host: 'localhost',
        port: '5000'
    });

    public oAuthClient: any;

    private tokensSet = false;

    constructor() {
        dotenv.load();
        this.oAuthClient = Youtube.authenticate({
            type: 'oauth',
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            redirect_url: process.env.REDIRECT_URL
        });

        opn(this.oAuthClient.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/youtube.upload']
        }));

        this.server.addPage('/oauth2callback', lien => {
            this.oAuthClient.getToken(lien.query.code, (err, tokens) => {
                if (tokens) {
                    this.tokensSet = true;
                    this.oAuthClient.setCredentials(tokens);
                }
            });
        });
    }

    insertPlaylist() {
        
    }
}
