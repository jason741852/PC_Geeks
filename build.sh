#!/bin/bash

refresh-both() {
	echo "Refreshing Angular and Django files..."
	vagrant ssh -c '
cd /home/ubuntu/angular;
ng build;
cd /home/ubuntu/django;
python3 manage.py makemigrations;
python3 manage.py migrate;
cd /home/ubuntu;
sudo touch reload.ini;'
}

print-help() {
	echo "Use '-a' to only refresh Angular or '-d' to only refresh Django."
	echo "Use '--d-migrate' to perform a database migration on Django."
	echo "No arguments or '-ad' will refresh both."
}

if [ $# -eq 1 ]; then
	if [ $1 = '-a' ]; then
		echo "Rebuilding Angular files..."
		vagrant ssh -c '
cd /home/ubuntu/angular;
ng build;'
	elif [ $1 = '-d' ]; then
		echo "Refreshing uWSGI (Django)..."
		vagrant ssh -c '
cd /home/ubuntu;
sudo touch reload.ini;'
	elif [ $1 = '--d-migrate' ]; then
		echo "Migrating Django database and refreshing uWSGI..."
		vagrant ssh -c '
cd /home/ubuntu/django;
python3 manage.py makemigrations;
python3 manage.py migrate;
cd /home/ubuntu;
sudo touch reload.ini;'
	elif [ $1 = '-ad' ] || [ $1 = '-da' ]; then
		refresh-both
	elif [ $1 = '-help' ] || [ $1 = '--help' ]; then
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