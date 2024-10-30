export default function $FooterScripts(config) {
    return `<script>
    const images = document.querySelectorAll('img');
    const attributes = ['src', 'srcset', 'sizes'];

    images.forEach((image) => {
        image.addEventListener('load', () => {
            image.setAttribute('data-lazy-loaded', true);
        });

        attributes.forEach((attribute) => {
            const value = image.getAttribute('data-' + attribute, '');

            if (value) {
                image.setAttribute(attribute, value);
            }
        });
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
