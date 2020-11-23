#
# script to workaround the issue that you can not access your
# heroku psql database from the default gitpod setup
#
# https://stackoverflow.com/a/63762256/430721
#
set -e

appname=$1

if [[ -z $appname ]]; then
    echo "usage: pushdatabase <appname>"
    exit 1
fi

# safe kill
kill -1 `cat ./srv/pid 2>/dev/null ` 2>/dev/null | cat


mainhost=$(echo $GITPOD_WORKSPACE_URL | cut -d . -f 2-4)
base_url="https://3001-$GITPOD_WORKSPACE_ID.$mainhost"

echo "---> starting tmp web server"
node ./srv/index.js&

echo "---> dumping DB..."
pg_dump -Fc --no-acl --no-owner -h localhost -U api shop > ./srv/data/shop.dump

echo "--> restoring DB... $base_url/shop.dump for $appname"
heroku pg:backups:restore $base_url/shop.dump DATABASE_URL -a $appname --confirm $appname

busy="yes"
while [[ $busy != "" ]]
do
  echo `date`"...Still busy..."
  sleep 2
  heroku pg:backups -a $appname > /tmp/t.txt
  start=$(awk '/Restores/{ print NR; exit }' /tmp/t.txt)
  end=$(awk '/Copies/{ print NR-1; exit }' /tmp/t.txt)
  busy=$(head -n $end /tmp/t.txt  | tail -n $start | grep Progress | cat)
done
echo `date`"...Done!"
rm /tmp/t.txt

echo "---> stopping tmp webserver..."
kill -1 `cat ./srv/pid`
rm ./srv/data/shop.dump


