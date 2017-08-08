#!/bin/bash

echo 'Running Django development server...'
if [ -d ./api/migrations ]; then
	echo 'Removing migrations'
	rm -r ./api/migrations
fi
if [ -f ./db.sqlite3 ] && [ $1 = '-d' ]; then
	echo 'Removing existing database'
	rm -r ./db.sqlite3
fi
python manage.py makemigrations api
python manage.py migrate
python manage.py loaddata test_data.json
python manage.py runserver
