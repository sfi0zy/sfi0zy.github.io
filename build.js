const fs = require('fs');
const path = require('path');
const sizeOf = require('image-size');

function shuffle(array) {
    let currentIndex = array.length;

    while (currentIndex != 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);

        currentIndex--;

        [array[currentIndex], array[randomIndex]] =
            [array[randomIndex], array[currentIndex]];
    }

    return array;
}

function generatePlaceholders(imagesList) {
    const placeholders = {};

    imagesList.forEach((name) => {
        const size = sizeOf(`./src/content/images/${name}.jpg`);
        const height = size.height;
        const width  = size.width;
        const startColor = '#eeeeee';
        const endColor = '#ffffff';
        const id = `svg-id-${Math.floor(Math.random() * 1000000)}`;

        placeholders[name] = `<svg version='1.1' xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 100 100' preserveAspectRatio='none' height='${height}' width='${width}'>
    <defs>
        <linearGradient id='${id}' x1='0%' y1='0%' x2='100%' y2='0%'
            gradientTransform='rotate(45)'>
            <stop offset='0%' style='stop-color:${startColor};stop-opacity:1' />
            <stop offset='100%' style='stop-color:${endColor};stop-opacity:1' />
        </linearGradient>
    </defs>
    <rect x='0' y='0' height='100' width='100' fill='url(#${id})' />
</svg>`
    });

    return placeholders;
}

function readPosts(postsDir) {
    const posts = [];
    let id = 0;

    fs.readdirSync(postsDir).forEach((year) => {
        fs.readdirSync(`${postsDir}/${year}`).forEach((filename) => {
            if (filename[0] === '.') {
                return;
            }

            try {
                const post = JSON.parse(
                    fs.readFileSync(
                        `${postsDir}/${year}/${filename}`,
                        'utf-8',
                    ),
                );

                post.slug = path.parse(filename).name.slice(11);
                post.id = id;

                posts.push(post);

                id++;
            } catch (e) {
                console.log(`ERR: invalid post: ${filename}`);
            }
        });
    });

    return posts;
}

function compileLazyImage(placeholders, id, alt) {
    const pixel = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

    return `<div class='lazy-image'>
    ${placeholders[id]}
    <img src='${pixel}'
        data-src='/images/${id}.jpg' alt='${alt}'>
    <noscript>
        <img src='/images/${id}' alt='${alt}' itemprop='image'>
    </noscript>
</div>`;
}

const html = (raw, placeholders) => {
    let result = raw;

    result = result.replaceAll('Q&A', 'Q&amp;A');

    const images = result.match(/\!\[.*?\)/g);

    if (images) {
        images.forEach((link) => {
            const alt = link.match(/\[(.*?)\]/)[1];
            const id = link.match(/\((.*?)\)/)[1];

            result = result.replace(
                link,
                compileLazyImage(placeholders, id, alt),
            )
        });
    }

    const links = result.match(/\[.*?\)/g);

    if (links) {
        links.forEach((link) => {
            const text = link.match(/\[(.*?)\]/)[1];
            const url = link.match(/\((.*?)\)/)[1];

            result = result.replace(link, `<a href='${url}'>${text}</a>`)
        });
    }

    return result;
}

function compileRSS(config, posts) {
    const date = (new Date).toUTCString();

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
                <description>${post.content.reduce((result, line) =>
                    `${result}${
                        typeof line === 'string' ? `<p>${html(line)}</p>` : ''
                    }`, '')}</description>
                <pubDate>${(new Date(post.date)).toUTCString()}</pubDate>
                <link>${config.url}/post/${post.slug}</link>
                <guid isPermaLink="true">${config.url}/post/${post.slug}</guid>
                ${post.tags.reduce((result, tag) => `${result}
                    <category>${tag}</category>`, '')}
            </item>`, '')
        }
    </channel>
</rss>`;
}

function compileCodePen(name, username, hash) {
    return `<p class='codepen' data-theme-id='light' data-default-tab='result'
    data-slug-hash='${hash}' data-preview='true' data-user='${username}'>
    <span>The Pen by ${
        name
    } (<a href='https://codepen.io/${username}'>@${username}</a>).</span>
</p>`;
}

function compileYouTube(hash) {
    return `<div class='youtube'>
    <iframe src='https://www.youtube.com/embed/${hash}'
        frameborder='0' allowfullscreen></iframe>
</div>`;
}

function compilePost(config, post, placeholders) {
    return `<article itemscope itemtype='https://schema.org/Blog'>
    <header>
        <h2 itemprop='headline'><a
            href='/post/${post.slug}'>${post.title}</a></h2>
        <div>
            <small>${post.date.replaceAll('-', '&nbsp;/&nbsp;')}</small>
        </div>
    </header>
    <div>
        ${compileLazyImage(placeholders, post.thumb, post.title)}
        <div itemprop='text'>${post.content.reduce((result, line) =>
            `${result}${
                typeof line === 'string' ? `<p>${html(line, placeholders)}</p>`
                    : (
                    line[0] === 'codepen' ? compileCodePen(
                        config.name, config.username, line[1],
                    ) : (
                        line[0] === 'youtube' ? compileYouTube(line[1])
                        : 'INVALID BLOCK'
                    )
                )
            }`,
        '')}</div>
    </div>
    <footer>
        <span>Tags:</span>
        <ul>
            ${post.tags.reduce((result, tag) =>
                `${result}<li><a href='/tag/${tag}'>${tag}</a></li>`, '')}
        </ul>
    </footer>
</article>`;
}

function compileRelatedPosts(postsData, post, placeholders) {
    const shuffledPostsData = shuffle([...postsData]);
    const relatedPostsData = [];
    const relatedPostsRequired = 3;

    for (let commonTagsRequired = 3; commonTagsRequired > 0; commonTagsRequired--) {
        for (let i = 0; i < shuffledPostsData.length; i++) {
            const candidate = shuffledPostsData[i];

            if ((candidate.id === post.id)
                || (relatedPostsData.find((p) => p.id === candidate.id))) {
                continue;
            }

            let commonTagsFound = 0;

            for (let j = 0; j < post.tags.length; j++) {
                if (candidate.tags.includes(post.tags[j])) {
                    commonTagsFound++;
                }
            }

            if (commonTagsFound >= commonTagsRequired) {
                relatedPostsData.push(candidate);

                if (relatedPostsData.length === relatedPostsRequired) {
                    break;
                }
            }
        }

        if (relatedPostsData.length === relatedPostsRequired) {
            break;
        }
    }

    if (relatedPostsData.length === 0) {
        return '';
    }

    return `<!--noindex-->
    <!--googleoff: index-->
    <aside>
        <article>
            <header>
                <h2>Related posts</h2>
            </header>
            ${relatedPostsData.reduce((result, post) => {
                return `${result}
                    <h3><a href='/post/${post.slug}'>${post.title}</a></h3>
                    ${compileLazyImage(placeholders, post.thumb, post.title)}`;
            }, '')}
        </article>
    </aside>
    <!--googleon: index-->
    <!--/noindex-->`;
}

function compileTagsCloud(config, postsData) {
    const tags = [...config.tags].sort();
    const counters = tags.map(
        (tag) => postsData.filter(
            (p) => p.tags.includes(tag)).length);
    const weights = counters.map((counter) => counter / tags.length);

    return `<nav>
    <ul>
        ${tags.reduce((result, tag, index) => {
            const fontSize = 80 + weights[index] * 30;
            const text = `${tag}&nbsp;(${counters[index]})&nbsp;`;

            return `${result}<li>
                <a href='/tag/${tag}/'
                    style='font-size: ${fontSize}%'>${text}</a>
            </li>`;
        }, '')}
    </ul>
</nav>`;
}

function compileHeader(config, logo) {
    return `<header>
    <div>${logo}</div>
    <h1><a href='/'>${config.name}</a></h1>
    <p>${config.position}</p>
</header>
<hr>
<nav>
    <ul>
        ${config.nav.reduce((result, link) => {
            return `${result}<li><a href='${link.url}'>${link.text}</a></li>`;
        }, '')}
    </ul>
</nav>
<hr>`;
}

function compileIcons(config) {
    const { v, themeColor, tileColor } = config.icons;

    return `<link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png?v=${v}'>
<link rel='icon' type='image/png' href='/favicon-32x32.png?v=${v}' sizes='32x32'>
<link rel='icon' type='image/png' href='/favicon-16x16.png?v=${v}' sizes='16x16'>
<link rel='manifest' href='/site.webmanifest.json?v=${v}'>
<meta name='msapplication-TileColor' content='${tileColor}'>
<meta name='theme-color' content='${themeColor}'>`;
}

function compileIndex(config, posts, tag) {
    const isHome = !tag;

    const selectedPosts = isHome ? posts :
        [...posts].filter((post) => post.tags.includes(tag));

    let result = '';

    const limit = isHome ? Math.max(
        0, selectedPosts.length - 1 - parseInt(config.homeIndexLimit)) : 0;

    for (let i = selectedPosts.length - 1; i >= limit; i--) {
        result = `${result} ${selectedPosts[i].compiled}`;
    }

    return result;
}

function compileFooterScripts(config) {
    return `<script>
    const images = document.querySelectorAll('img');
    const attributes = ['src', 'srcset', 'sizes'];

    images.forEach((image) => {
        image.addEventListener('load', () => {
            image.setAttribute('data-lazy-loaded', true);
        });

        attributes.forEach((attribute) => {
            const value = image.getAttribute('data-' + attribute, '');

            if (value) {
                image.setAttribute(attribute, value);
            }
        });
    });
</script>

<script src='https://cpwebassets.codepen.io/assets/embed/ei.js'></script>
<script src='https://www.googletagmanager.com/gtag/js?id=${config.gtagid}'></script>

<script>
    window.dataLayer = window.dataLayer || [];

    function gtag() {
        dataLayer.push(arguments);
    }

    gtag('js', new Date());
    gtag('config', '${config.gtagid}');
</script>`;
}

function compilePage(url, config, title, description, content, parts) {
    return `<!DOCTYPE html>
<html lang='en'>
    <head>
        <meta charset='utf-8'>
        <title>${title}</title>
        <meta name='description' content='${description}'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <link rel='canonical' href='${url}'>
        <link rel='alternate' type='application/rss+xml'
            title='${config.title}' href='${config.url}/feed.xml'>
        <link rel='prefetch' href='https://cpwebassets.codepen.io/assets/embed/ei.js'>
        <link rel='prefetch' href='https://www.googletagmanager.com/gtag/js?id=${config.gtagid}'>
        ${compileIcons(config)}
        <style>${parts.css}</style>
    </head>
    <body>
        ${parts.header}
        <main>${content}</main>
        ${parts.tagsCloud}
        <footer>Copyright &copy; ${config.name} 2016-${(new Date()).getFullYear()}</footer>
        ${parts.footerScripts}
    </body>
</html>

    `;
}

function main() {
    const config = JSON.parse(fs.readFileSync('./src/site-config.json', 'utf-8'));
    const css = fs.readFileSync('./src/style.css', 'utf-8');
    const logo = fs.readFileSync('./src/logo.svg', 'utf-8');

    const placeholders = generatePlaceholders(
        fs.readdirSync('./src/content/images')
            .map((name) => path.parse(name).name),
    );

    const header = compileHeader(config, logo);
    const footerScripts = compileFooterScripts(config);

    const postsData = readPosts('./src/content/posts');
    const tagsCloud = compileTagsCloud(config, postsData);

    const parts = { header, tagsCloud, footerScripts, css };

    const posts = postsData.map((post) => {
        return {
            ...post,
            compiled: compilePost(config, post, placeholders),
        };
    }).map((post) => {
        return {
            ...post,
            compiledPage: compilePage(
                `${config.url}/post/${post.slug}.html`,
                config,
                `${post.title} | ${config.title}`,
                post.title,
                `${post.compiled} ${
                    compileRelatedPosts(postsData, post, placeholders)}`,
                parts,
            ),
        };
    });

    const rss = compileRSS(config, posts);

    const staticPages = [];

    fs.readdirSync('./src/static').forEach((filename) => {
        if (filename[0] === '.') {
            return;
        }

        const page = fs.readFileSync(`./src/static/${filename}`, 'utf-8');
        const slug = path.parse(filename).name;
        const compiled = compilePage(
            `${config.url}/${slug}.html`,
            config,
            `${config.static[slug].title} | ${config.title}`,
            config.static[slug].title,
            html(page, placeholders),
            parts,
        );

        staticPages.push({ slug, compiled });
    });

    const index = compilePage(
        `${config.url}/index.html`,
        config,
        config.title,
        config.title,
        compileIndex(config, posts, null),
        parts,
    );

    const tagPages = config.tags.map((tag) => {
        return {
            slug: tag,
            compiled: compilePage(
                `${config.url}/tag/${tag}/`,
                config,
                `Search for ${tag}`,
                `Search for the posts tagged with #${tag}`,
                compileIndex(config, posts, tag),
                parts,
            ),
        };
    });

    fs.rmSync('./dist', { recursive: true, force: true });
    fs.mkdirSync('./dist');
    fs.cpSync('./src/content/files', './dist/files', { recursive: true });
    fs.cpSync('./src/content/images', './dist/images', { recursive: true });
    fs.cpSync('./src/icons', './dist', { recursive: true });
    fs.cpSync('./src/robots.txt', './dist/robots.txt');
    fs.writeFileSync('./dist/feed.xml', rss, 'utf-8');

    fs.mkdirSync('./dist/post');
    posts.forEach((post) => {
        fs.writeFileSync(
            `./dist/post/${post.slug}.html`,
            post.compiledPage,
            'utf-8',
        );
    });

    staticPages.forEach((page) => {
        fs.mkdirSync(`./dist/${page.slug}`);
        fs.writeFileSync(`./dist/${page.slug}/index.html`, page.compiled, 'utf-8');
    });

    fs.mkdirSync('./dist/tag');
    tagPages.forEach((page) => {
        fs.mkdirSync(`./dist/tag/${page.slug}`);
        fs.writeFileSync(`./dist/tag/${page.slug}/index.html`, page.compiled, 'utf-8');
    });

    fs.writeFileSync('./dist/index.html', index, 'utf-8');
}

main();
