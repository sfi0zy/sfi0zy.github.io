export default function $FooterScripts() {
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
`;
}
