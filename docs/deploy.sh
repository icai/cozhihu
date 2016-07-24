cd _site
if [ -d .git ]; then
  echo "inited"
else
  # echo $PWD
  git init
  git add -A
  git commit -m "site init"
  git branch -m gh-pages
  git remote add -t gh-pages origin git@github.com:icai/cozhihu.git
fi;
# fetch pages
git fetch origin gh-pages:gh-pages
git add -A
NOW=$(date -u '+%F %T %Z')
git commit -m "update site at $NOW"
git push origin gh-pages:gh-pages
