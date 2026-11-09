export default function $Index(config, posts, tag) {
    const isHome = !tag;

    const selectedPosts = isHome ? [...posts].filter((post) => post.pinned)
        : [...posts].filter((post) => post.tags.includes(tag));

    let result = isHome ? ''
        : `<br><br><header><h2>${config.texts.tagPageHeader} "#${tag}"</h2></header>`;

    for (let i = selectedPosts.length - 1; i >= 0; i--) {
        if (isHome) {
            result = `${result}<img class='thumbtack' src='/images/thumbtack.jpg'/>`;
        }

        result = `${result} ${selectedPosts[i].compiledPostOnly}`;
    }

    if (isHome) {
        result = `${result}<div class='center'>.&nbsp;.&nbsp;.</div>`;
        result = `${result}<br><br><div class='center'>${config.texts.homePageQuestion}</div>`;
    }

    return result;
}
