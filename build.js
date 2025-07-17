import fs from 'fs';
import path from 'path';

import { minify as minifyCSS } from 'csso';
import { minify as minifyHTML } from 'html-minifier-terser';

import loadPostsData from './src/js/loaders/loadPostsData.js';
import loadSitemapData from './src/js/loaders/loadSitemapData.js';
import loadStaticPagesData from './src/js/loaders/loadStaticPagesData.js';

import $Page from './src/js/templates/page.js';
import $Header from './src/js/templates/header.js';
import $Index from './src/js/templates/index.js';
import $TagsCloud from './src/js/templates/tags-cloud.js';
import $FooterScripts from './src/js/templates/footer-scripts.js';

import $RSS from './src/js/templates/rss.js';
import $Sitemap from './src/js/templates/sitemap.js';

import $$Posts from './src/js/templates/collections/posts.js';
import $$StaticPages from './src/js/templates/collections/static-pages.js';
import $$TagPages from './src/js/templates/collections/tag-pages.js';

import generatePlaceholders from './src/js/modules/placeholders.js';

// 1

const config = JSON.parse(fs.readFileSync('./src/site-config.json', 'utf-8'));

const data = {
    posts: loadPostsData('./src/content/posts'),
    static: loadStaticPagesData('./src/content/static'),
};

data.sitemap = loadSitemapData(
    config,
    { static: './src/content/static', files: './src/content/files' },
    data.posts,
);

const placeholders = generatePlaceholders(
    fs.readdirSync('./src/content/images')
        .map((i) => path.parse(i).name),
);

const parts = {
    header: $Header(config, fs.readFileSync('./src/logo.svg', 'utf-8')),
    tagsCloud: $TagsCloud(config, data.posts),
    footerScripts: $FooterScripts(config),
    css: minifyCSS(
        fs.readFileSync('./src/css/style.css', 'utf-8'),
        { restructure: false },
    ).css,
};

const posts = $$Posts(config, data.posts, placeholders, parts);

const home = $Page(
    `${config.url}`,
    config,
    config.title,
    config.title,
    $Index(config, posts, null),
    parts,
);

const staticPages = $$StaticPages(config, data.static, placeholders, parts);
const tagPages = $$TagPages(config, posts, parts);
const rss = $RSS(config, posts);
const sitemap = $Sitemap(data.sitemap);

// 2

fs.rmSync('./dist', { recursive: true, force: true });
fs.mkdirSync('./dist');
fs.cpSync('./src/content/files', './dist/files', { recursive: true });
fs.cpSync('./src/content/images', './dist/images', { recursive: true });
fs.cpSync('./src/icons', './dist', { recursive: true });
fs.cpSync('./src/robots.txt', './dist/robots.txt');
fs.writeFileSync('./dist/feed.xml', rss, 'utf-8');
fs.writeFileSync('./dist/sitemap.xml', sitemap, 'utf-8');
fs.mkdirSync('./dist/post');
fs.mkdirSync('./dist/tag');

const settings = {
    collapseWhitespace: true,
    conservativeCollapse: true,
    minifyJS: true,
};

const homeHtml = await minifyHTML(home, settings);

fs.writeFileSync('./dist/index.html', homeHtml, 'utf-8');

for (const post of posts) { // eslint-disable-line no-restricted-syntax
    // eslint-disable-next-line no-await-in-loop
    const html = await minifyHTML(post.compiled, settings);

    fs.writeFileSync(`./dist/post/${post.slug}.html`, html, 'utf-8');
}

for (const page of staticPages) { // eslint-disable-line no-restricted-syntax
    // eslint-disable-next-line no-await-in-loop
    const html = await minifyHTML(page.compiled, settings);

    fs.mkdirSync(`./dist/${page.slug}`);
    fs.writeFileSync(`./dist/${page.slug}/index.html`, html, 'utf-8');
}

for (const page of tagPages) { // eslint-disable-line no-restricted-syntax
    // eslint-disable-next-line no-await-in-loop
    const html = await minifyHTML(page.compiled, settings);

    fs.mkdirSync(`./dist/tag/${page.slug}`);
    fs.writeFileSync(`./dist/tag/${page.slug}/index.html`, html, 'utf-8');
}
