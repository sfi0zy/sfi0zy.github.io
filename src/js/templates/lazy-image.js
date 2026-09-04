export default function $LazyImage(config, placeholders, id, alt) {
    const safeAlt = alt.replaceAll('\'', '');

    return `<div class='lazy-image'>
    ${placeholders[id]}
        <img src='/${config.dirs.images}/${id}.jpg' alt='${safeAlt}' itemprop='image'>
</div>`;
}
