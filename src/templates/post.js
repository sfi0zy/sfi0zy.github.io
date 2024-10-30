import $CodePen from './codepen.js';
import $HTML from './html.js';
import $LazyImage from './lazy-image.js';
import $YouTube from './youtube.js';

export default function $Post(config, post, placeholders) {
    return `<article itemscope itemtype='https://schema.org/Blog'>
    <header>
        <h2 itemprop='headline'><a
            href='/post/${post.slug}'>${post.title}</a></h2>
        <div>
            <small>${post.date.replaceAll('-', '&nbsp;/&nbsp;')}</small>
        </div>
    </header>
    <div>
        ${$LazyImage(placeholders, post.thumb, post.title)}
        <div itemprop='text'>${post.content.reduce((result, line) => `${result}${
        typeof line === 'string' ? `<p>${$HTML(line, placeholders)}</p>` // eslint-disable-line no-nested-ternary
            : (line[0] === 'codepen' // eslint-disable-line no-nested-ternary, sonarjs/no-nested-conditional
                ? $CodePen(config.name, config.username, line[1])
                : (line[0] === 'youtube' // eslint-disable-line no-nested-ternary, sonarjs/no-nested-conditional
                    ? $YouTube(line[1])
                    : 'INVALID BLOCK'))
    }`,
    '')}</div>
    </div>
    <footer>
        <span>Tags:</span>
        <ul>
            ${post.tags.reduce((result, tag) => `${result}<li><a href='/tag/${tag}'>${tag}</a></li>`, '')}
        </ul>
    </footer>
</article>`;
}
