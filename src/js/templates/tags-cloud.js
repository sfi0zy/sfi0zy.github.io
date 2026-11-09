export default function $TagsCloud(config, postsData) {
    const tags = [...config.tags].map((g) => g.sort());
    const N = tags.reduce((result, group) => result + group.length, 0);

    const counters = tags.map((group) => group.map(
        (tag) => postsData.filter(
            (p) => p.tags.includes(tag)).length));

    const weights = counters.map((group) => group.map(
        (counter) => counter / N));

    return `<nav>
    <h2>${config.texts.tagsCloudHeader}</h2>
    <br>
    ${tags.reduce((t, group, groupIndex) => `${t}
    ${groupIndex === 1 ? '<br><br>' : ''}
    ${groupIndex > 1 ? '<br><br>+<br><br>' : ''}
    <ul>
    ${group.reduce((result, tag, index) => {
        const fontSize = (tag === config.archiveTag)
            ? 100 : Math.min(160, 70 + weights[groupIndex][index] * 30);

        const prefix = config.importantTag === tag ? '&starf;&nbsp;' : '';

        const text = `${prefix}${tag}&nbsp;(${counters[groupIndex][index]})&nbsp;`;

        return `${result}<li>
            <a href='/${config.dirs.tag}/${tag}/'
                style='font-size: ${fontSize}%'>${text}</a>
        </li>`;
    }, '')}
    </ul>
    `, '')}
    <br>
</nav>`;
}
