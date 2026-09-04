import fs from 'fs';
import path from 'path';
import sizeOf from 'image-size';

export default function generatePlaceholders(dir) {
    const imagesList = fs.readdirSync(dir).map((i) => path.parse(i).name);
    const placeholders = {};

    imagesList.forEach((name) => {
        const size = sizeOf(`./src/content/images/${name}.jpg`);
        const { width, height } = size;
        const startColor = '#eeeeee';
        const endColor = '#ffffff';

        // eslint-disable-next-line sonarjs/pseudo-random
        const id = `svg-id-${Math.floor(Math.random() * 1000000)}`;

        placeholders[name] = `<svg version='1.1' xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 100 100' preserveAspectRatio='none' height='${height}' width='${width}'>
    <defs>
        <linearGradient id='${id}' x1='0%' y1='0%' x2='100%' y2='0%'
            gradientTransform='rotate(45)'>
            <stop offset='0%' style='stop-color:${startColor};stop-opacity:1' />
            <stop offset='100%' style='stop-color:${endColor};stop-opacity:1' />
        </linearGradient>
    </defs>
    <rect x='0' y='0' height='100' width='100' fill='url(#${id})' />
</svg>`;
    });

    return placeholders;
}
