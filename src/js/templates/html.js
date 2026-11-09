import $LazyImage from './lazy-image.js';

export default function $HTML(config, raw, placeholders) {
    let result = raw;

    const images = result.match(/!\[.*?\)/g);

    if (images) {
        images.forEach((link) => {
            // eslint-disable-next-line sonarjs/super-linear-regex
            const alt = link.match(/\[(.*?)\]/)[1];
            // eslint-disable-next-line sonarjs/super-linear-regex
            const id = link.match(/\((.*?)\)/)[1];

            result = result.replace(
                link,
                $LazyImage(config, placeholders, id, alt),
            );
        });
    }

    // eslint-disable-next-line sonarjs/super-linear-regex
    const links = result.match(/\[.*?\)/g);

    if (links) {
        links.forEach((link) => {
            // eslint-disable-next-line sonarjs/super-linear-regex
            const text = link.match(/\[(.*?)\]/)[1];
            // eslint-disable-next-line sonarjs/super-linear-regex
            const url = link.match(/\((.*?)\)/)[1];

            result = result.replace(link, `<a href='${url}'>${text}</a>`);
        });
    }

    return result;
}
