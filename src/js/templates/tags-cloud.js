export default function $TagsCloud(config, postsData) {
    const tags = [...config.tags].map((g) => g.sort());
    const N = tags.reduce((result, group) => result + group.length, 0);

    const counters = tags.map((group) => group.map(
        (tag) => postsData.filter(
            (p) => p.tags.includes(tag)).length));

    const weights = counters.map((group) => group.map(
        (counter) => counter / N));

    return `<nav>
    <h2>Search for:</h2>
    <br>
    ${tags.reduce((t, group, groupIndex) => `${t}
    ${groupIndex > 0 ? '<br><br>+<br><br>' : ''}
    <ul>
    ${group.reduce((result, tag, index) => {
        const fontSize = 80 + weights[groupIndex][index] * 30;
        const prefix = config.importantTag === tag ? '&starf;&nbsp;' : '';
        const text = `${prefix}${tag}&nbsp;(${counters[groupIndex][index]})&nbsp;`;

        return `${result}<li>
            <a href='/tag/${tag}/'
                style='font-size: ${fontSize}%'>${text}</a>
        </li>`;
    }, '')}
    </ul>
    `, '')}
</nav>`;
}
