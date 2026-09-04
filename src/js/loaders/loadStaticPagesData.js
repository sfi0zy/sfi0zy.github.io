import fs from 'fs';
import path from 'path';

export default function loadStaticPagesData(dir) {
    const pages = [];
    const slugs = [];

    fs.readdirSync(dir).forEach((filename) => {
        if (filename[0] === '.') {
            return;
        }

        pages.push(fs.readFileSync(`${dir}/${filename}`, 'utf-8'));
        slugs.push(path.parse(filename).name);
    });

    return { pages, slugs };
}
