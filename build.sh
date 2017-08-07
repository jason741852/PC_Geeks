#!/bin/bash

refresh-both() {
	echo "Refreshing Angular and Django files..."
	vagrant ssh -c '
cd /home/ubuntu/angular;
ng build;
cd /home/ubuntu;
sudo touch reload.ini;'
}

print-help() {
	echo "Use '-a' to only refresh Angular or '-d' to only refresh Django."
	echo "Use '--npm' to run 'npm install' in your vagrant box."
	echo "Use '--migrate' to perform a database migration on Django."
	echo "Use '--recreate-database' to squash migrations and recreates the database."
	echo "No arguments or '-ad' will refresh both."
}

if [ $# -eq 1 ]; then
	if [ $1 = '-a' ]; then
		echo "Rebuilding Angular files..."
		vagrant ssh -c '
cd /home/ubuntu/angular;
ng build;'
	elif [ $1 = '--npm' ]; then
		echo "Installing Angular dependencies..."
		vagrant ssh -c '
source .profile;
cd /home/ubuntu/angular;
npm install --no-bin-links;'
	elif [ $1 = '-d' ]; then
		echo "Refreshing uWSGI (Django)..."
		vagrant ssh -c '
cd /home/ubuntu;
sudo touch reload.ini;'
	elif [ $1 = '--migrate' ]; then
		echo "Migrating Django database and refreshing uWSGI..."
		vagrant ssh -c '
source /home/ubuntu/.profile;
cd /home/ubuntu/django;
python3 manage.py makemigrations api;
python3 manage.py migrate;
sudo touch /home/ubuntu/reload.ini;'
	elif [ $1 = '--recreate-database' ]; then
		echo "Squashing migrations and recreating the database..."
		vagrant ssh -c '
source /home/ubuntu/.profile;
bash /home/ubuntu/recreate-database.sh;
cd /home/ubuntu/django;
rm -r api/migrations;
python3 manage.py makemigrations api;
python3 manage.py migrate;
python3 manage.py loaddata test_data.json;
sudo touch /home/ubuntu/reload.ini;'
	elif [ $1 = '-ad' ] || [ $1 = '-da' ]; then
		refresh-both
	elif [ $1 = '-h' ] || [ $1 = '-help' ] || [ $1 = '--help' ]; then
		print-help
	else
		echo "Invalid arguments!"
		print-help
	fi
elif [ $# -gt 1 ]; then
	echo "Too many arguments!"
	print-help
else
	refresh-both
fi