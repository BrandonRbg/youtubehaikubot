import * as youtubeUrl from 'youtube-url'
import * as snoowrap from 'snoowrap'

let r = null;

type Params = {
    time: string,
    limit: number
}

export default {
    init: () => {
        r = new snoowrap({
            userAgent: 'NodeJS request. No useragent.',
            clientId: process.env.REDDIT_CLIENT_ID,
            clientSecret: process.env.REDDIT_CLIENT_SECRET,
            username: process.env.REDDIT_USERNAME,
            password: process.env.REDDIT_PASSWORD
        })
    },
    getTopPostsYoutubeIds: (o: Params) => {
        const defaults = {
            time: 'week',
            limit: 20
        };

        const options = Object.assign({}, defaults, o);

        return r.getSubreddit('youtubehaiku')
            .getTop(options)
            .then(result => {
                const res = [];

                for (let listing of result) {
                    const listingUrl = listing.url;
                    if (listingUrl) {
                        const id = youtubeUrl.extractId(listingUrl);
                        id && res.push(id)
                    }
                }

                return res
            })
    }
}
