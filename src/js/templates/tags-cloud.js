export default function $TagsCloud(config, postsData) {
    const tags = [...config.tags].sort();
    const counters = tags.map((tag) => postsData.filter((p) => p.tags.includes(tag)).length);
    const weights = counters.map((counter) => counter / tags.length);

    return `<nav>
    <h2>Search for:</h2>
    <br>
    <ul>
    ${tags.reduce((result, tag, index) => {
        const fontSize = 80 + weights[index] * 30;
        const prefix = config.importantTag === tag ? '&starf;&nbsp;' : '';
        const text = `${prefix}${tag}&nbsp;(${counters[index]})&nbsp;`;

        return `${result}<li>
            <a href='/tag/${tag}/'
                style='font-size: ${fontSize}%'>${text}</a>
        </li>`;
    }, '')}
    </ul>
</nav>`;
}
