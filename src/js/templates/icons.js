export default function $Icons(config) {
    const { v, themeColor, tileColor } = config.icons;

    return `<link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png?v=${v}'>
<link rel='icon' type='image/png' href='/favicon-32x32.png?v=${v}' sizes='32x32'>
<link rel='icon' type='image/png' href='/favicon-16x16.png?v=${v}' sizes='16x16'>
<link rel='manifest' href='/site.webmanifest.json?v=${v}'>
<meta name='msapplication-TileColor' content='${tileColor}'>
<meta name='theme-color' content='${themeColor}'>`;
}
