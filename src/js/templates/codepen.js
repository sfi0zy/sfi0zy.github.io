export default function $CodePen(name, username, hash) {
    return `<p class='codepen' data-theme-id='light' data-default-tab='result'
    data-slug-hash='${hash}' data-preview='true' data-user='${username}'>
    <span>The Pen by ${name} (<a href='https://codepen.io/${username}'>@${username}</a>).</span>
</p>`;
}
