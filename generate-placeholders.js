console.log('Creating placeholders...');

const Handlebars  = require('handlebars');
const ColorThief  = require('color-thief');
const rgbHex      = require('rgb-hex');
const sizeOf      = require('image-size');
const fs          = require('fs');


const thief = new ColorThief();


console.log('NPM Dependencies loaded...');


const template = Handlebars.compile(fs.readFileSync('image-placeholder-template.svg', 'utf-8'));


fs.readdir('images/', (err, filenames) => {
    if (err) {
        console.log('ERROR' + err);
        return;
    }

    console.log('IMAGES:');
    console.log(filenames);

    filenames.forEach((filename) => {
        if (filename.split('.').pop() !== 'jpg') {
            return;
        }

        const image  = fs.readFileSync('images/' + filename);
        const size = sizeOf('images/' + filename);
        const height = size.height;
        const width  = size.width;

        const palette = thief.getPalette(image, 2);

        const startColor = '#' + rgbHex(...palette[0]);
        const endColor   = '#' + rgbHex(...palette[1]);

        // We generate two similar placeholders to use one for small image
        // and another (with different id) fot image in modal window.
        // It's weird solution, but we use it because we don't prepare
        // images of bigger sizes for modal windows.

        const id1 = 'svg-id-' + Math.floor(Math.random() * 1000000);
        const id2 = 'svg-id-' + Math.floor(Math.random() * 1000000);

        const svg1 = template({
            height,
            width,
            startColor,
            endColor,
            gradientUniqueID: id1
        });

        const svg2 = template({
            height,
            width,
            startColor,
            endColor,
            gradientUniqueID: id2
        });

        fs.writeFileSync('images/' + filename + '-1.svg', svg1, 'utf-8');
        fs.writeFileSync('images/' + filename + '-2.svg', svg2, 'utf-8');

        console.log('ok: ' + filename);
    });
});


