export default function $YouTube(hash) {
    return `<div class='youtube'>
    <iframe src='https://www.youtube.com/embed/${hash}'
        frameborder='0' allowfullscreen></iframe>
</div>`;
}
