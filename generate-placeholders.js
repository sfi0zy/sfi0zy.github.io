console.log('Creating placeholders...');

const Handlebars  = require('handlebars');
const ColorThief  = require('color-thief');
const rgbHex      = require('rgb-hex');
const sizeOf      = require('image-size');
const fs          = require('fs');


const thief = new ColorThief();


console.log('NPM Dependencies loaded...');


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

        const template = Handlebars.compile(fs.readFileSync('image-placeholder-template.svg', 'utf-8'));
        const svg = template({
            height,
            width,
            startColor,
            endColor
        });

        fs.writeFileSync('images/' + filename + '.svg', svg, 'utf-8');
        console.log('ok: ' + filename);
    });
});


