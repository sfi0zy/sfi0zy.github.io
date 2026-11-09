import fs from 'fs';
import path from 'path';
import sizeOf from 'image-size';

export default function generatePlaceholders(dir) {
    const imagesList = fs.readdirSync(dir).map((i) => path.parse(i).name);
    const placeholders = {};

    imagesList.forEach((name) => {
        const size = sizeOf(`${dir}/${name}.jpg`);
        const { width, height } = size;

        placeholders[name] = `<svg version='1.1' xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 100 100' preserveAspectRatio='none' height='${height}' width='${width}'>
    <rect x='0' y='0' height='100' width='100' fill='#eeeeee' />
</svg>`;
    });

    return placeholders;
}
