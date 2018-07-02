import google from "googleapis";
import dotenv from "dotenv"

import Lien from "lien";

const OAuth2 = google.auth.OAuth2;


const server = new Lien({
    host: 'localhost',
    port: 5000
});

const oauth2Client = new OAuth2(
    'YOUR_CLIENT_ID',
    'YOUR_CLIENT_SECRET',
    'http://localhost:5000/oauthcallback'
);