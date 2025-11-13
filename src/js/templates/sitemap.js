export default function $Sitemap(urls) {
    return `<?xml version='1.0' encoding='UTF-8'?>
<urlset xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance'
    xsi:schemaLocation='http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd'
    xmlns='http://www.sitemaps.org/schemas/sitemap/0.9'>
    ${urls.reduce((res, url) => `${res}
    <url>
        <loc>${encodeURI(url.url)}</loc>
        <priority>${url.priority ? url.priority.toLocaleString('en', { minimumFractionDigits: 1 }) : 0.5}</priority>
        <lastmod>${url.lastmod}</lastmod>
    </url>`, '')}
</urlset>
`;
}
