export default function $LazyImage(placeholders, id, alt) {
    const safeAlt = alt.replaceAll('\'', '');

    return `<div class='lazy-image'>
    ${placeholders[id]}
        <img src='/images/${id}.jpg' alt='${safeAlt}' itemprop='image'>
</div>`;
}
