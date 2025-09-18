import fs from 'fs';
import path from 'path';

export default function loadPostsData(postsDir) {
    const postsData = [];
    let id = 0;

    fs.readdirSync(postsDir).forEach((year) => {
        fs.readdirSync(`${postsDir}/${year}`).forEach((filename) => {
            if (filename[0] === '.') {
                return;
            }

            try {
                const post = JSON.parse(fs.readFileSync(`${postsDir}/${year}/${filename}`, 'utf-8'));

                post.slug = path.parse(filename).name.slice(11);
                post.id = id;

                postsData.push(post);

                id++;
            } catch (e) { // eslint-disable-line sonarjs/no-ignored-exceptions
                console.log(`ERR: invalid post: ${filename}`);
            }
        });
    });

    return postsData;
}
