
# Update package list
execute 'apt_update' do
  command 'apt-get update'
end
execute 'node_packages_update' do
	command 'curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -'
end

# Install necessary packages
package "python3"
package "nginx"
package "postgresql"
package "postgresql-server-dev-all"
package "libpython-dev"
package "python3-pip"
package "nodejs"
package "build-essential"

# Setup pip
execute 'install_django' do
	command 'pip3 install django djangorestframework psycopg2 uwsgi'
end

# Setup Postgres
execute 'postgres_create_database' do
	command 'echo "CREATE DATABASE mydb; CREATE USER ubuntu WITH PASSWORD \'123\'; GRANT ALL PRIVILEGES ON DATABASE mydb TO ubuntu;" | sudo -u postgres psql'
end

# Setup Django
execute 'django_makemigrations' do
	command 'python3 manage.py makemigrations'
	cwd '/home/ubuntu/django'
end
execute 'django_migrate' do
	command 'python3 manage.py migrate'
	cwd '/home/ubuntu/django'
end
# execute 'django_static_files' do
# 	command 'python3 manage.py collectstatic --noinput'
# 	cwd '/home/ubuntu/django'
# end
# execute 'django_load_data' do
# 	command 'python3 manage.py loaddata initial_data.json'
# 	cwd '/home/ubuntu/django'
# end

# Setup and run Django server with uWSGI
cookbook_file 'rc.local' do
	path '/etc/rc.local'
end
execute 'uwsgi_run_server' do
	command 'uwsgi --ini uwsgi.ini --daemonize /var/log/django.log --touch-reload=/home/ubuntu/reload.ini'
	cwd '/home/ubuntu/django'
end
execute 'uwsgi_reload_server' do
	command 'touch /home/ubuntu/reload.ini'
end

# Setup npm
cookbook_file '.npmrc' do
	path '/home/ubuntu/.npmrc'
end
execute 'make_npm_packages_dir' do
	command 'mkdir ~/.npm-packages'
end
execute 'npm_packages_env_var' do
	command 'export NPM_PACKAGES="${HOME}/.npm-packages"'
end
execute 'path_env_var' do
	command 'export PATH="$NPM_PACKAGES/bin:$PATH"'
	not_if '[ -a /home/ubuntu/path_set ]'
end
execute 'path_provision' do
	command 'touch /home/ubuntu/path_set'
end
execute 'unset_manpath_env_var' do
	command 'unset MANPATH'
	not_if '[ -a /home/ubuntu/manpath_set ]'
end
execute 'manpath_env_var' do
	command 'export MANPATH="$NPM_PACKAGES/share/man:$(manpath)"'
	not_if '[ -a /home/ubuntu/manpath_set ]'
end
execute 'manpath_provision' do
	command 'touch /home/ubuntu/manpath_set'
end

# Setup Angular
execute "install_angular" do
	command 'npm install -g @angular/cli'
	ignore_failure true
end
execute 'npm_install' do
	command 'npm install --no-bin-links'
	cwd '/home/ubuntu/angular'
end
# execute 'run_angular_server' do
# 	command 'ng serve >> /var/log/ng.log &'
# 	cwd '/home/ubuntu/angular'
# end

# Setup nginx
cookbook_file "nginx-default" do
	path "/etc/nginx/sites-available/default"
end
execute 'nginx_reload_config' do
	command 'nginx -s reload'
end
