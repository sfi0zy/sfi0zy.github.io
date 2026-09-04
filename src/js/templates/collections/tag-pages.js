import $Page from '../page.js';
import $Index from '../index.js';

export default function $$TagPages(config, posts, parts) {
    return config.tags.flat().map((tag) => ({
        slug: tag,
        compiled: $Page(
            `${config.url}/tag/${tag}/`,
            config,
            `#${tag} | ${config.title}`,
            `Search for the posts tagged with #${tag}`,
            $Index(config, posts, tag),
            parts,
        ),
    }));
}
