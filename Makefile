install:
	bundle install
	npm ci

build:
	node ./_scripts/generate-placeholders.js
	bundle exec jekyll clean
	bundle exec jekyll build
	# Remove temporary SVG images, they are already inlined into HMTL.
	rm ./_site/images/*.svg
	rm ./images/*.svg
	# Fix wrong encoding in books links.
	sed -i 's/%20%D0%9D%D0%BE%D1%82%D0%BD%D0%B0%D1%8F%20%D1%82%D0%B5%D1%82%D1%80%D0%B0%D0%B4%D1%8C%20No1%20/%20%D0%9D%D0%BE%D1%82%D0%BD%D0%B0%D1%8F%20%D1%82%D0%B5%D1%82%D1%80%D0%B0%D0%B4%D1%8C%20%E2%84%961%20/g' ./_site/sitemap.xml
	sed -i 's/%20%D0%9D%D0%BE%D1%82%D0%BD%D0%B0%D1%8F%20%D1%82%D0%B5%D1%82%D1%80%D0%B0%D0%B4%D1%8C%20No2%20/%20%D0%9D%D0%BE%D1%82%D0%BD%D0%B0%D1%8F%20%D1%82%D0%B5%D1%82%D1%80%D0%B0%D0%B4%D1%8C%20%E2%84%962%20/g' ./_site/sitemap.xml

watch:
	node ./_scripts/generate-placeholders.js
	bundle exec jekyll clean
	bundle exec jekyll serve --incremental

deploy:
	git checkout source
	git pull
	make build
	git add .
	git commit -m "Update"
	git push origin source
	git branch -D master || true
	git checkout --orphan master
	rm -r `find . | grep -v "_site" | grep -v ".git"` || true
	cp -r _site/* .
	git add .
	git commit -m "Rebuild website"
	git push origin master -f
	git checkout source

clean:
	rm -rf ./node_modules
