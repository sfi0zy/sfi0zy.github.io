import $Icons from './icons.js';

export default function $Page(url, config, title, description, content, parts) {
    return `<!DOCTYPE html>
<html lang='en'>
    <head>
        <meta charset='utf-8'>
        <title>${title}</title>
        <meta name='description' content='${description.replaceAll('\'', '')}'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <meta name='google-site-verification' content='U2bDWZUhJfke-2dwiUdGRjEZ_HSPdg6s3e37lPRHgjQ' />
        <link rel='canonical' href='${url}'>
        ${$Icons()}
        <style>${parts.css}</style>
    </head>
    <body>
        ${parts.header}
        <main>${content}</main>
        ${parts.tagsCloud}
        <footer>${config.texts.copyright} &copy; ${config.copyrightYears[0]}-${config.copyrightYears[1]} ${config.name}</footer>
    </body>
</html>

    `;
}
