export default function $LazyImage(placeholders, id, alt) {
    const pixel = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    const safeAlt = alt.replaceAll('\'', '');

    return `<div class='lazy-image'>
    ${placeholders[id]}
    <img src='${pixel}'
        data-src='/images/${id}.jpg' alt='${safeAlt}'>
    <noscript>
        <img src='/images/${id}' alt='${safeAlt}' itemprop='image'>
    </noscript>
</div>`;
}
