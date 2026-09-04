import $HTML from './html.js';
import $LazyImage from './lazy-image.js';

export default function $Post(config, post, placeholders) {
    return `<article itemscope itemtype='https://schema.org/Blog'>
    <header>
        <h2 itemprop='headline'><a
            href='/${config.dirs.post}/${post.slug}'>${post.title}</a></h2>
        <div>
            <small>${post.date.replaceAll('-', '&nbsp;/&nbsp;')}</small>
        </div>
    </header>
    <div>
        ${$LazyImage(config, placeholders, post.thumb, post.title)}
        <div itemprop='text'>${post.content.reduce(
        (result, line) => `${result}<p>${$HTML(config, line, placeholders)}</p>`, '')}</div>
    </div>
    <footer>
        <span>${config.texts.tags}:</span>
        <ul>
            ${post.tags.reduce((result, tag) => `${result}<li><a href='/${config.dirs.tag}/${tag}'>#${tag}</a></li>`, '')}
        </ul>
    </footer>
</article>`;
}
