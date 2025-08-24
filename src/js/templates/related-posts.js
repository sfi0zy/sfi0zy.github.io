import $LazyImage from './lazy-image.js';

import shuffle from '../utils/shuffle.js';

// eslint-disable-next-line sonarjs/cognitive-complexity
export default function $RelatedPosts(postsData, post, placeholders) {
    const shuffledPostsData = shuffle([...postsData]);
    const relatedPostsData = [];
    const relatedPostsRequired = 3;

    for (let commonTagsRequired = 3; commonTagsRequired > 0; commonTagsRequired--) {
        // eslint-disable-next-line sonarjs/prefer-for-of
        for (let i = 0; i < shuffledPostsData.length; i++) {
            const candidate = shuffledPostsData[i];

            if (candidate.is_archived === 'true') {
                continue; // eslint-disable-line no-continue
            }

            if ((candidate.id === post.id)
                || (relatedPostsData.find((p) => p.id === candidate.id))) {
                continue; // eslint-disable-line no-continue
            }

            let commonTagsFound = 0;

            // eslint-disable-next-line sonarjs/prefer-for-of
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
            ${relatedPostsData.reduce((result, p) => `${result}
                <h3><a href='/post/${p.slug}'>${p.title}</a></h3>
                ${$LazyImage(placeholders, p.thumb, p.title)}`, '')}
        </article>
    </aside>
    <!--googleon: index-->
    <!--/noindex-->`;
}
