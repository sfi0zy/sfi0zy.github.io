import fs from 'fs';

import { minify as minifyCSS } from 'csso';
import { minify as minifyHTML } from 'html-minifier-terser';

import loadPostsData from './src/js/loaders/loadPostsData.js';
import loadSitemapData from './src/js/loaders/loadSitemapData.js';
import loadStaticPagesData from './src/js/loaders/loadStaticPagesData.js';

import $Page from './src/js/templates/page.js';
import $Header from './src/js/templates/header.js';
import $Index from './src/js/templates/index.js';
import $TagsCloud from './src/js/templates/tags-cloud.js';
import $Sitemap from './src/js/templates/sitemap.js';
import $$Posts from './src/js/templates/collections/posts.js';
import $$StaticPages from './src/js/templates/collections/static-pages.js';
import $$TagPages from './src/js/templates/collections/tag-pages.js';

import generatePlaceholders from './src/js/modules/placeholders.js';

const config = JSON.parse(fs.readFileSync('./src/site-config.json', 'utf-8'));
const postsData = loadPostsData('./src/content/posts');
const placeholders = generatePlaceholders('./src/content/images');
const header = $Header(config, fs.readFileSync('./src/logo.svg', 'utf-8'));
const tagsCloud = $TagsCloud(config, postsData);
const { css } = minifyCSS(fs.readFileSync('./src/css/style.css', 'utf-8'), { restructure: false });
const parts = { header, tagsCloud, css };

const posts = $$Posts(config, postsData, placeholders, parts);
const home = $Page(`${config.url}`, config, config.title, config.description, $Index(config, posts, null), parts);
const staticPages = $$StaticPages(config, loadStaticPagesData('./src/content/static'), placeholders, parts);
const tagPages = $$TagPages(config, posts, parts);
const dirs = { static: './src/content/static', files: './src/content/files' };
const sitemap = $Sitemap(loadSitemapData(config, dirs, postsData));

fs.rmSync('./dist', { recursive: true, force: true });
fs.mkdirSync('./dist');
fs.cpSync('./src/content/files', './dist/files', { recursive: true });
fs.cpSync('./src/content/images', './dist/images', { recursive: true });
fs.cpSync('./src/icons', './dist', { recursive: true });
fs.cpSync('./src/robots.txt', './dist/robots.txt');
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
