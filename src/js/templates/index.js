export default function $Index(config, posts, tag) {
    const isHome = !tag;

    const selectedPosts = isHome ? [...posts].filter((post) => post.pinned)
        : [...posts].filter((post) => post.tags.includes(tag));

    let result = isHome ? '' : `<br><br><header><h2>Search results for "${tag}"</h2></header>`;

    const limit = isHome
        ? Math.max(0, selectedPosts.length - 1 - parseInt(config.homeIndexLimit, 10))
        : 0;

    for (let i = selectedPosts.length - 1; i >= limit; i--) {
        result = `${result} ${selectedPosts[i].compiledPostOnly}`;
    }

    if (isHome) {
        result = `${result}<div class='center'>.&nbsp;.&nbsp;.</div>`;
        result = `${result}<br><br><div class='center'>Looking for something?</div>`;
    }

    return result;
}
