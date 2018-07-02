import * as dotenv from "dotenv"
import rf from './src/reddit-fetcher'

dotenv.load();

// Debug code please remove
rf.init()
rf.getTopPostsYoutubeIds({
    time: 'week',
    limit: +process.env.PLAYLIST_SIZE || 100
}).then(res => console.log(res))
