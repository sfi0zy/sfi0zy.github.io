import $Page from '../page.js';
import $Post from '../post.js';
import $RelatedPosts from '../related-posts.js';

export default function $$Posts(config, postsData, placeholders, parts) {
    return postsData.map((post) => ({
        ...post,
        compiledPostOnly: $Post(config, post, placeholders),
    })).map((post) => ({
        ...post,
        compiled: $Page(
            `${config.url}/post/${post.slug}`,
            config,
            `${post.title} | ${config.title}`,
            post.title,
            `${post.compiledPostOnly} ${
                $RelatedPosts(postsData, post, placeholders)}`,
            parts,
        ),
    }));
}
