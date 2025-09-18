import $HTML from '../html.js';
import $Page from '../page.js';

export default function $$StaticPages(config, data, placeholders, parts) {
    const { pages, slugs } = data;
    const staticPages = [];

    for (let i = 0; i < pages.length; i++) {
        const slug = slugs[i];

        const compiled = $Page(
            `${config.url}/${slug}`,
            config,
            `${config.static[slug].title} | ${config.title}`,
            config.static[slug].title,
            $HTML(pages[i], placeholders),
            parts,
        );

        staticPages.push({ slug, compiled });
    }

    return staticPages;
}
