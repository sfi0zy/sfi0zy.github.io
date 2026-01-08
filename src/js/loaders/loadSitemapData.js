import fs from 'fs';
import path from 'path';

const PRIORITY = Object.freeze({
    TOP: 1.0,
    HIGH: 0.8,
    NORMAL: 0.4,
    LOW: 0.1,
});

export default function loadSitemapData(config, dirs, postsData) {
    const urls = [];
    const posts = [...postsData].reverse();

    urls.push({
        url: `${config.url}`,
        lastmod: postsData.at(-1).date,
    });

    fs.readdirSync(dirs.static).forEach((filename) => {
        if (filename[0] === '.') {
            return;
        }

        const slug = path.parse(filename).name;

        urls.push({
            url: `${config.url}/${slug}`,
            priority: PRIORITY.TOP,
            lastmod: config.static[slug]?.lastmod,
        });
    });

    fs.readdirSync(dirs.files).forEach((file) => {
        const slug = file.replaceAll(' ', '%20');

        const year = slug.match(/\d{4}/)[0];
        const isArchived = config.books.archivedYears.includes(year);

        if (isArchived) {
            return;
        }

        const defaultDay = '01';
        const defaultMonth = '01';

        urls.push({
            url: `${config.url}/files/${slug}`,
            priority: isArchived ? PRIORITY.LOW : PRIORITY.TOP,
            lastmod: `${year}-${defaultMonth}-${defaultDay}`,
        });
    });

    posts.forEach((post) => {
        const isImportant = post.tags.includes(config.importantTag);

        urls.push({
            url: `${config.url}/post/${post.slug}`,
            priority: isImportant ? PRIORITY.HIGH : PRIORITY.NORMAL,
            lastmod: post.date,
        });
    });

    config.tags.forEach((group) => {
        group.forEach((tag) => {
            const isImportant = tag === config.importantTag;

            urls.push({
                url: `${config.url}/tag/${tag}`,
                priority: isImportant ? PRIORITY.TOP : PRIORITY.LOW,
                lastmod: posts.filter((post) => post.tags.includes(tag))[0].date,
            });
        });
    });

    return urls;
}
