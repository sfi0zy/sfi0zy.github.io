export default function $Header(config, logo) {
    return `<header>
    <div>${logo}</div>
    <h1><a href='/'>${config.name}</a></h1>
</header>
<hr>
<nav>
    <ul>
        ${config.nav.reduce((result, link) => `${result}<li><a href='${link.url}'>${link.text}</a></li>`, '')}
    </ul>
</nav>
<hr>`;
}
