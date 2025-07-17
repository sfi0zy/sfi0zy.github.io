import $Page from '../page.js';
import $Post from '../post.js';
import $RelatedPosts from '../related-posts.js';

export default function $$Posts(config, postsData, placeholders, parts) {
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
