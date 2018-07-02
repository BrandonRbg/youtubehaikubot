import { YoutubeClient } from './youtube/youtubeClient';
import rf from './reddit-fetcher';
import * as opn from 'opn';
import * as Progress from 'progress';
import * as moment from 'moment';

require('dotenv').load();

const youtubeClient = new YoutubeClient();

youtubeClient.onAuthorize.subscribe(async authorized => {
    rf.init();
    const videos = await rf.getTopPostsYoutubeIds({
        time: 'week',
        limit: +process.env.PLAYLIST_SIZE
    });
    const progressBar = new Progress(':bar', {total: videos.length});
    const playlistId = await youtubeClient.insertPlaylist({
        title: `/r/youtubehaiku Week ${moment().week()} ${moment().year()}`,
        description: ''
    });
    for (let videoId of videos) {
        try {
            await youtubeClient.insertVideoToPlaylist({
                playlistId,
                videoId
            });
            progressBar.tick();
        } catch (e) {
            console.log(e);
        }
    }

    opn(`https://www.youtube.com/playlist?list=${playlistId}`);

});
