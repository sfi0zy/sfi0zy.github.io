COMMIT_MESSAGE=$1

printf "\nDEPLOY\n"

printf " -> [source]\n"
git checkout source
./build.sh
printf "[source] add all files to git\n"
git add .
printf "[source] commit $COMMIT_MESSAGE\n"
git commit -m "$COMMIT_MESSAGE"
printf "(!) [source] push to GitHub\n"
git push origin source

printf " -> [master]\n"
git checkout master
printf "[master] remove old build\n"
rm -r `find . | grep -v "_site" | grep -v ".git"`
printf "[master] copy new build\n"
cp -r _site/* .
printf "[master] add all files to git\n"
git add .
printf "[master] commit\n"
git commit -m "Rebuild website"
printf "(!) [master] push to GitHub\n"
git push origin master

printf " -> [source]\n"
git checkout source