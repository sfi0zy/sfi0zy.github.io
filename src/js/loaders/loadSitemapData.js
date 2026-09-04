import fs from 'fs';
import path from 'path';

const PRIORITY = Object.freeze({
    HIGH: 1.0,
    NORMAL: 0.5,
});

export default function loadSitemapData(config, dirs, postsData) {
    const urls = [];
    const posts = [...postsData].reverse();

    urls.push({
        url: `${config.url}`,
        priority: PRIORITY.HIGH,
        lastmod: postsData.at(-1).date,
    });

    fs.readdirSync(dirs.static).forEach((filename) => {
        if (filename[0] === '.') {
            return;
        }

        const slug = path.parse(filename).name;

        if (config.static[slug]?.archived) {
            return;
        }

        urls.push({
            url: `${config.url}/${slug}`,
            priority: PRIORITY.HIGH,
            lastmod: config.static[slug]?.lastmod,
        });
    });

    const importantPosts = posts
        .filter((post) => post.tags.includes(config.importantTag));

    urls.push({
        url: `${config.url}/tag/${config.importantTag}`,
        priority: PRIORITY.HIGH,
        lastmod: importantPosts[0].date,
    });

    posts.forEach((post) => {
        if (post.tags.includes(config.archiveTag)) {
            return;
        }

        urls.push({
            url: `${config.url}/post/${post.slug}`,
            priority: PRIORITY.NORMAL,
            lastmod: post.date,
        });
    });

    return urls;
}
