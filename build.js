import fs from 'fs';
import path from 'path';

import { minify as minifyCSS } from 'csso';
import { minify as minifyHTML } from 'html-minifier-terser';

import $FooterScripts from './src/templates/footer-scripts.js';
import $Header from './src/templates/header.js';
import $HTML from './src/templates/html.js';
import $Index from './src/templates/index.js';
import $Page from './src/templates/page.js';
import $Post from './src/templates/post.js';
import $RelatedPosts from './src/templates/related-posts.js';
import $RSS from './src/templates/rss.js';
import $Sitemap from './src/templates/sitemap.js';
import $TagsCloud from './src/templates/tags-cloud.js';

import generatePlaceholders from './src/modules/placeholders.js';

const UTF_8 = 'utf-8';

const PRIORITY = Object.freeze({
    TOP: 1,
    HIGH: 0.75,
    NORMAL: 0.5,
    LOW: 0.25,
});

const DEFAULT_DAY = '01';
const DEFAULT_MONTH = '01';

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
                        UTF_8,
                    ),
                );

                post.slug = path.parse(filename).name.slice(11);
                post.id = id;

                postsData.push(post);

                id++;
            } catch (e) { // eslint-disable-line sonarjs/no-ignored-exceptions
                console.log(`ERR: invalid post: ${filename}`);
            }
        });
    });

    return postsData;
}

function generateParts(config, postsData) {
    return {
        header: $Header(config, fs.readFileSync('./src/logo.svg', UTF_8)),
        tagsCloud: $TagsCloud(config, postsData),
        footerScripts: $FooterScripts(config),
        css: minifyCSS(
            fs.readFileSync('./src/style.css', UTF_8),
            { restructure: false },
        ).css,
    };
}

function generatePosts(config, postsData, placeholders, parts) {
    return postsData.map((post) => ({
        ...post,
        compiled: $Post(config, post, placeholders),
    })).map((post) => ({
        ...post,
        compiledPage: $Page(
            `${config.url}/post/${post.slug}`,
            config,
            `${post.title} | ${config.title}`,
            post.title,
            `${post.compiled} ${
                $RelatedPosts(postsData, post, placeholders)}`,
            parts,
        ),
    }));
}

function generateIndex(config, posts, parts) {
    return $Page(
        `${config.url}`,
        config,
        config.title,
        config.title,
        $Index(config, posts, null),
        parts,
    );
}

function generateStaticPages(config, placeholders, parts) {
    const staticPages = [];

    fs.readdirSync('./src/static').forEach((filename) => {
        if (filename[0] === '.') {
            return;
        }

        const page = fs.readFileSync(`./src/static/${filename}`, UTF_8);
        const slug = path.parse(filename).name;

        const compiled = $Page(
            `${config.url}/${slug}`,
            config,
            `${config.static[slug].title} | ${config.title}`,
            config.static[slug].title,
            $HTML(page, placeholders),
            parts,
        );

        staticPages.push({ slug, compiled });
    });

    return staticPages;
}

function generateTagPages(config, posts, parts) {
    return config.tags.map((tag) => ({
        slug: tag,
        compiled: $Page(
            `${config.url}/tag/${tag}`,
            config,
            `Search for ${tag}`,
            `Search for the posts tagged with #${tag}`,
            $Index(config, posts, tag),
            parts,
        ),
    }));
}

function generateSitemap(config, postsData) {
    const urls = [];

    urls.push({
        url: `${config.url}`,
        lastmod: postsData.at(-1).date,
    });

    fs.readdirSync('./src/static').forEach((filename) => {
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

    fs.readdirSync('./src/content/files').forEach((file) => {
        const slug = file.replaceAll(' ', '%20');

        const year = slug.match(/\d{4}/)[0];
        const isArchived = config.books.archivedYears.includes(year);

        urls.push({
            url: `${config.url}/files/${slug}`,
            priority: isArchived ? PRIORITY.LOW : PRIORITY.TOP,
            lastmod: `${year}-${DEFAULT_MONTH}-${DEFAULT_DAY}`,
        });
    });

    postsData.reverse().forEach((post) => {
        const isImportant = post.tags.includes(config.importantTag);

        urls.push({
            url: `${config.url}/post/${post.slug}`,
            priority: isImportant ? PRIORITY.HIGH : PRIORITY.NORMAL,
            lastmod: post.date,
        });
    });

    config.tags.forEach((tag) => {
        urls.push({
            url: `${config.url}/tag/${tag}`,
            priority: PRIORITY.LOW,
            lastmod: [...postsData]
                .filter((post) => post.tags.includes(tag))[0].date,
        });
    });

    return $Sitemap(urls);
}

async function write(index, posts, staticPages, tagPages, rss, sitemap) {
    fs.rmSync('./dist', { recursive: true, force: true });
    fs.mkdirSync('./dist');
    fs.cpSync('./src/content/files', './dist/files', { recursive: true });
    fs.cpSync('./src/content/images', './dist/images', { recursive: true });
    fs.cpSync('./src/icons', './dist', { recursive: true });
    fs.cpSync('./src/robots.txt', './dist/robots.txt');
    fs.writeFileSync('./dist/feed.xml', rss, UTF_8);
    fs.writeFileSync('./dist/sitemap.xml', sitemap, UTF_8);

    const htmlMinificationSettings = {
        collapseWhitespace: true,
        conservativeCollapse: true,
        minifyJS: true,
    };

    fs.mkdirSync('./dist/post');

    // eslint-disable-next-line no-restricted-syntax
    for (const post of posts) {
        // eslint-disable-next-line no-await-in-loop
        const html = await minifyHTML(
            post.compiledPage,
            htmlMinificationSettings,
        );

        fs.writeFileSync(`./dist/post/${post.slug}.html`, html, UTF_8);
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const page of staticPages) {
        // eslint-disable-next-line no-await-in-loop
        const html = await minifyHTML(
            page.compiled,
            htmlMinificationSettings,
        );

        fs.mkdirSync(`./dist/${page.slug}`);
        fs.writeFileSync(`./dist/${page.slug}/index.html`, html, UTF_8);
    }

    fs.mkdirSync('./dist/tag');

    // eslint-disable-next-line no-restricted-syntax
    for (const page of tagPages) {
        // eslint-disable-next-line no-await-in-loop
        const html = await minifyHTML(
            page.compiled,
            htmlMinificationSettings,
        );

        fs.mkdirSync(`./dist/tag/${page.slug}`);
        fs.writeFileSync(`./dist/tag/${page.slug}/index.html`, html, UTF_8);
    }

    const indexHtml = await minifyHTML(index, htmlMinificationSettings);

    fs.writeFileSync('./dist/index.html', indexHtml, UTF_8);
}

function main() {
    const config = JSON.parse(
        fs.readFileSync('./src/site-config.json', UTF_8),
    );

    const postsData = loadPostsData('./src/content/posts');

    const imagesList = fs.readdirSync('./src/content/images')
        .map((i) => path.parse(i).name);

    const placeholders = generatePlaceholders(imagesList);
    const parts = generateParts(config, postsData);
    const posts = generatePosts(config, postsData, placeholders, parts);
    const index = generateIndex(config, posts, parts);
    const staticPages = generateStaticPages(config, placeholders, parts);
    const tagPages = generateTagPages(config, posts, parts);
    const rss = $RSS(config, posts);
    const sitemap = generateSitemap(config, postsData);

    write(index, posts, staticPages, tagPages, rss, sitemap);
}

main();
