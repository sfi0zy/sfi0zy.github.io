import $LazyImage from './lazy-image.js';

export default function $HTML(raw, placeholders) {
    let result = raw;

    result = result.replaceAll('Q&A', 'Q&amp;A');

    const images = result.match(/!\[.*?\)/g);

    if (images) {
        images.forEach((link) => {
            const alt = link.match(/\[(.*?)\]/)[1]; // eslint-disable-line sonarjs/slow-regex
            const id = link.match(/\((.*?)\)/)[1]; // eslint-disable-line sonarjs/slow-regex

            result = result.replace(link, $LazyImage(placeholders, id, alt));
        });
    }

    const links = result.match(/\[.*?\)/g); // eslint-disable-line sonarjs/slow-regex

    if (links) {
        links.forEach((link) => {
            const text = link.match(/\[(.*?)\]/)[1]; // eslint-disable-line sonarjs/slow-regex
            const url = link.match(/\((.*?)\)/)[1]; // eslint-disable-line sonarjs/slow-regex

            result = result.replace(link, `<a href='${url}'>${text}</a>`);
        });
    }

    return result;
}
