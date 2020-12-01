git pull origin master
git add -A
set /p Message= "Wat upload je? "
git commit -m %Message%
git push -u origin master