const Handlebars  = require('handlebars');
const thief       = require('./node_modules/color-thief/dist/color-thief.js');
const rgbHex      = require('rgb-hex');
const sizeOf      = require('image-size');
const fs          = require('fs');

const template = Handlebars.compile(fs.readFileSync('image-placeholder-template.svg', 'utf-8'));

fs.readdir('images/', (err, filenames) => {
    if (err) {
        console.log(`ERROR ${err}`);
        return;
    }

    filenames.forEach((filename) => {
        if (filename.split('.').pop() !== 'jpg') {
            return;
        }

        const size = sizeOf(`images/${filename}`);
        const height = size.height;
        const width  = size.width;

        thief.getPalette(`images/${filename}`, 2).then((palette) => {
            const startColor = '#' + rgbHex(...palette[0]);
            const endColor   = '#' + rgbHex(...palette[1]);

            const id = `svg-id-${Math.floor(Math.random() * 1000000)}`;

            const svg = template({
                height,
                width,
                startColor,
                endColor,
                gradientUniqueID: id
            });

            fs.writeFileSync(`images/${filename}.svg`, svg, 'utf-8');

            console.log(`jpg -> svg: ${filename}`);
        });
    });
});

