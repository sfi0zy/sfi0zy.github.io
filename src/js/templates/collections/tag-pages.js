import $Page from '../page.js';
import $Index from '../index.js';

export default function $$TagPages(config, posts, parts) {
    return config.tags.flat().map((tag) => ({
        slug: tag,
        compiled: $Page(
            `${config.url}/${config.dirs.tag}/${tag}/`,
            config,
            `#${tag} | ${config.title}`,
            `${config.texts.tagPageHeader} #${tag}`,
            $Index(config, posts, tag),
            parts,
        ),
    }));
}
