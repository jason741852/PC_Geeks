
# Update package list
execute 'apt_update' do
  command 'apt-get update'
end

# Install necessary packages
package "python3"
package "nginx"
package "postgresql"
package "postgresql-server-dev-all"
package "libpython-dev"
package "python-pip"

# Setup pip
execute 'install_django' do
	command 'pip install django psycopg2 uwsgi'
end

# Setup Postgres
execute 'postgres_create_database' do
	command 'echo "CREATE DATABASE django_contacts_demo; CREATE USER ubuntu WITH PASSWORD \'hunter2\'; GRANT ALL PRIVILEGES ON DATABASE django_contacts_demo TO ubuntu;" | sudo -u postgres psql'
end

# Setup Django
execute 'django_makemigrations' do
	command 'python manage.py makemigrations'
	cwd '/home/ubuntu/exercise-8'
end
execute 'django_migrate' do
	command 'python manage.py migrate'
	cwd '/home/ubuntu/exercise-8'
end
execute 'django_static_files' do
	command 'python manage.py collectstatic --noinput'
	cwd '/home/ubuntu/exercise-8'
end
execute 'django_load_data' do
	command 'python manage.py loaddata initial_data.json'
	cwd '/home/ubuntu/exercise-8'
end

# Setup and run server with uWSGI
cookbook_file 'rc.local' do
	path '/etc/rc.local'
end
execute 'uwsgi_run_server' do
	command 'uwsgi --ini uwsgi.ini --daemonize /var/log/django-contacts.log --touch-reload=/tmp/reload.ini'
	cwd '/home/ubuntu/exercise-8'
end
execute 'uwsgi_reload_server' do
	command 'touch /tmp/reload.ini'
end

# Setup nginx
cookbook_file "nginx-default" do
	path "/etc/nginx/sites-available/default"
end
execute 'nginx_reload_config' do
	command 'nginx -s reload'
end
