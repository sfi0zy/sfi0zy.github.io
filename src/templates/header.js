export default function $Header(config, logo) {
    return `<header>
    <div>${logo}</div>
    <h1><a href='/'>${config.name}</a></h1>
    <p>${config.position}</p>
</header>
<hr>
<nav>
    <ul>
        ${config.nav.reduce((result, link) => {
            return `${result}<li><a href='${link.url}'>${link.text}</a></li>`;
        }, '')}
    </ul>
</nav>
<hr>`;
}
