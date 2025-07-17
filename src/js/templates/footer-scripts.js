export default function $FooterScripts(config) {
    return `<script>
    const images = document.querySelectorAll('img');

    images.forEach((image) => {
        if (image.complete) {
            image.setAttribute('data-lazy-loaded', true);
        } else {
            image.addEventListener('load', () => {
                image.setAttribute('data-lazy-loaded', true);
            });
        }
    });
</script>

<script src='https://cpwebassets.codepen.io/assets/embed/ei.js'></script>
<script src='https://www.googletagmanager.com/gtag/js?id=${config.gtagid}'></script>

<script>
    window.dataLayer = window.dataLayer || [];

    function gtag() {
        dataLayer.push(arguments);
    }

    gtag('js', new Date());
    gtag('config', '${config.gtagid}');
</script>`;
}
