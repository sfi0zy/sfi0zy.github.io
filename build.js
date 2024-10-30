import fs from 'fs';
import path from 'path';

import $FooterScripts from './src/templates/footer-scripts.js';
import $Header from './src/templates/header.js';
import $HTML from './src/templates/html.js';
import $Index from './src/templates/index.js';
import $Page from './src/templates/page.js';
import $Post from './src/templates/post.js';
import $RelatedPosts from './src/templates/related-posts.js';
import $RSS from './src/templates/rss.js';
import $TagsCloud from './src/templates/tags-cloud.js';

import generatePlaceholders from './src/modules/placeholders.js';

function loadPostsData(postsDir) {
    const postsData = [];
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

                postsData.push(post);

                id++;
            } catch (e) {
                console.log(`ERR: invalid post: ${filename}`);
            }
        });
    });

    return postsData;
}

function main() {
    const config = JSON.parse(fs.readFileSync('./src/site-config.json', 'utf-8'));
    const postsData = loadPostsData('./src/content/posts');

    const placeholders = generatePlaceholders(
        fs.readdirSync('./src/content/images')
            .map((name) => path.parse(name).name),
    );

    const header = $Header(config, fs.readFileSync('./src/logo.svg', 'utf-8'));
    const tagsCloud = $TagsCloud(config, postsData);
    const footerScripts = $FooterScripts(config);
    const css = fs.readFileSync('./src/style.css', 'utf-8');

    const parts = { header, tagsCloud, footerScripts, css };

    const posts = postsData.map((post) => {
        return {
            ...post,
            compiled: $Post(config, post, placeholders),
        };
    }).map((post) => {
        return {
            ...post,
            compiledPage: $Page(
                `${config.url}/post/${post.slug}.html`,
                config,
                `${post.title} | ${config.title}`,
                post.title,
                `${post.compiled} ${
                    $RelatedPosts(postsData, post, placeholders)}`,
                parts,
            ),
        };
    });

    const rss = $RSS(config, posts);

    const staticPages = [];

    fs.readdirSync('./src/static').forEach((filename) => {
        if (filename[0] === '.') {
            return;
        }

        const page = fs.readFileSync(`./src/static/${filename}`, 'utf-8');
        const slug = path.parse(filename).name;
        const compiled = $Page(
            `${config.url}/${slug}.html`,
            config,
            `${config.static[slug].title} | ${config.title}`,
            config.static[slug].title,
            $HTML(page, placeholders),
            parts,
        );

        staticPages.push({ slug, compiled });
    });

    const index = $Page(
        `${config.url}/index.html`,
        config,
        config.title,
        config.title,
        $Index(config, posts, null),
        parts,
    );

    const tagPages = config.tags.map((tag) => {
        return {
            slug: tag,
            compiled: $Page(
                `${config.url}/tag/${tag}/`,
                config,
                `Search for ${tag}`,
                `Search for the posts tagged with #${tag}`,
                $Index(config, posts, tag),
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
