const sizeOf      = require('image-size');
const fs          = require('fs');

const IMG_DIR = `${__dirname}/../images`;

const SVG_TEMPLATE = `<svg
    version='1.1'
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 100 100'
    preserveAspectRatio='none'
    height='{{ height }}'
    width='{{ width }}'>
    <defs>
        <linearGradient id='{{ gradientUniqueID }}'
            x1='0%'
            y1='0%'
            x2='100%'
            y2='0%'
            gradientTransform='rotate(45)'>
            <stop offset='0%'   style='stop-color:{{ startColor }};stop-opacity:1' />
            <stop offset='100%' style='stop-color:{{ endColor }};stop-opacity:1' />
        </linearGradient>
    </defs>
    <rect x='0' y='0' height='100' width='100' fill='url(#{{ gradientUniqueID }})' />
</svg>`;

function mustache(string, data) {
    for (let key in data) {
        const regexp = new RegExp(`{{\\s*${key}\\s*}}`, 'g');

        string = string.replace(regexp, data[key]);
    }

    return string;
};

fs.readdir(IMG_DIR, (err, filenames) => {
    if (err) {
        console.log(`ERROR ${err}`);

        return;
    }

    console.log('Generating placeholders for images...');

    filenames.forEach((filename) => {
        if (filename.split('.').pop() !== 'jpg') {
            return;
        }

        console.log(filename);

        const size = sizeOf(`${IMG_DIR}/${filename}`);
        const height = size.height;
        const width  = size.width;

        const svg = mustache(SVG_TEMPLATE, {
            height,
            width,
            startColor: '#eeeeee',
            endColor: '#ffffff',
            gradientUniqueID: `svg-id-${Math.floor(Math.random() * 1000000)}`,
        });

        fs.writeFileSync(`${IMG_DIR}/${filename}.svg`, svg, 'utf-8');
    });
});

