import $HTML from './html.js';

export default function $RSS(config, posts) {
    const date = (new Date()).toUTCString();

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${config.title}</title>
<description>${config.description}</description>
<link>${config.url}/</link>
<atom:link href="${`${config.url}/feed.xml`}" rel="self"
type="application/rss+xml"/>
<pubDate>${date}</pubDate>
<lastBuildDate>${date}</lastBuildDate>
${posts.slice(-10).reverse().reduce((result, post) => `${result}
    <item>
    <title>${post.title}</title>
    <description>${post.content.reduce((res, line) => `${res}${
        typeof line === 'string' ? `<p>${$HTML(line)}</p>` : ''
    }`, '')}</description>
    <pubDate>${(new Date(post.date)).toUTCString()}</pubDate>
    <link>${config.url}/post/${post.slug}</link>
    <guid isPermaLink="true">${config.url}/post/${post.slug}</guid>
    ${post.tags.reduce((res, tag) => `${res}
        <category>${tag}</category>`, '')}
    </item>`, '')
}
</channel>
</rss>`;
}
