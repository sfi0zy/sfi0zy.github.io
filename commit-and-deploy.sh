COMMIT_MESSAGE=$1

git checkout source
./build.sh
git add .
git commit -m "$COMMIT_MESSAGE"
git push origin source

git branch -D master
git checkout --orphan master
rm -r `find . | grep -v "_site" | grep -v ".git"`
cp -r _site/* .
git add .
git commit -m "Rebuild website"
git push origin master -f

git checkout source

