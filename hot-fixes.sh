# Jekyll-sitemap converts char "№" into the word "No" instead of "%E2%84%96".
# No time to search for an official solution. The bug affects two PDF files only.

printf '\nHot fixes:\n'
printf '    ./_site/sitemap.xml -> [bug in jekyll-sitemap] -> Replace "No" with "%%E2%%84%%96" in the PDF names.'

sed -i 's/%20%D0%9D%D0%BE%D1%82%D0%BD%D0%B0%D1%8F%20%D1%82%D0%B5%D1%82%D1%80%D0%B0%D0%B4%D1%8C%20No1%20/%20%D0%9D%D0%BE%D1%82%D0%BD%D0%B0%D1%8F%20%D1%82%D0%B5%D1%82%D1%80%D0%B0%D0%B4%D1%8C%20%E2%84%961%20/g' ./_site/sitemap.xml
sed -i 's/%20%D0%9D%D0%BE%D1%82%D0%BD%D0%B0%D1%8F%20%D1%82%D0%B5%D1%82%D1%80%D0%B0%D0%B4%D1%8C%20No2%20/%20%D0%9D%D0%BE%D1%82%D0%BD%D0%B0%D1%8F%20%D1%82%D0%B5%D1%82%D1%80%D0%B0%D0%B4%D1%8C%20%E2%84%962%20/g' ./_site/sitemap.xml

printf '\n'


# We don't need to save SVG placeholders in _site directory.
# They should be already inlined into pages. So we delete them.

printf '    ./_site/images [unnecessary files] -> delete SVG placeholders.'
rm ./_site/images/*.svg
printf '\n'

printf '    ./images [unnecessary files] -> delete SVG placeholders.'
rm ./images/*.svg
printf '\n'

