export default function $LazyImage(placeholders, id, alt) {
    const pixel = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

    return `<div class='lazy-image'>
    ${placeholders[id]}
    <img src='${pixel}'
        data-src='/images/${id}.jpg' alt='${alt}'>
    <noscript>
        <img src='/images/${id}' alt='${alt}' itemprop='image'>
    </noscript>
</div>`;
}
