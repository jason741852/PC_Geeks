
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

# Set environment variables
cookbook_file '.profile' do
	path '/home/ubuntu/.profile'
end
ENV['DJANGO_SETTINGS_MODULE'] = 'final.settings_production'
ENV['NPM_PACKAGES']           = "${HOME}/.npm-packages"
ENV['MANPATH']                = "$NPM_PACKAGES/share/man:$(manpath)"
ENV['PATH']                   = "/opt/chef/embedded/bin:$NPM_PACKAGES/bin:$HOME/bin:
                                $HOME/.local/bin:/usr/local/sbin:/usr/local/bin:
                                /usr/sbin:/usr/bin:/sbin:/bin"

# Setup pip
execute 'install_django' do
	command 'pip3 install django djangorestframework django-filter psycopg2 uwsgi'
end

# Setup Postgres
execute 'postgres_create_database' do
	command 'echo "CREATE DATABASE prod_db; CREATE USER ubuntu WITH PASSWORD \'hunter2\'; GRANT ALL PRIVILEGES ON DATABASE prod_db TO ubuntu;" | sudo -u postgres psql'
end

# Setup Django
cookbook_file "recreate-database.sh" do
	path "/home/ubuntu/recreate-database.sh"
end
directory '/home/ubuntu/django/api/migrations' do
	recursive true
	action :delete
end
execute 'django_makemigrations' do
	command 'python3 manage.py makemigrations api'
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
execute 'django_load_user_data' do
	command 'python3 manage.py loaddata initial_user_data.json'
	cwd '/home/ubuntu/django'
end
execute 'django_load_post_data' do
	command 'python3 manage.py loaddata initial_post_data.json'
	cwd '/home/ubuntu/django'
end
execute 'django_load_messaging_data' do
	command 'python3 manage.py loaddata initial_messaging_data.json'
	cwd '/home/ubuntu/django'
end
execute 'django_load_potential_buyer_data' do
	command 'python3 manage.py loaddata initial_potential_buyer_data.json'
	cwd '/home/ubuntu/django'
end
execute 'django_load_rating_data' do
	command 'python3 manage.py loaddata initial_rating_data.json'
	cwd '/home/ubuntu/django'
end
execute 'django_load_image_data' do
	command 'python3 manage.py loaddata initial_image_data.json'
	cwd '/home/ubuntu/django'
end

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
directory '/home/ubuntu/.npm-packages' do
	action :create
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
execute 'npm_install_node-sass' do
	command 'npm install --no-bin-links node-sass'
	cwd '/home/ubuntu/angular'
end
execute 'npm_install_@agm/core' do
	command 'npm install @agm/core --save'
	cwd '/home/ubuntu/angular'
end
execute 'npm_install_@types/googlemaps' do
	command 'npm install @types/googlemaps --save-dev'
	cwd '/home/ubuntu/angular'
end
execute 'build_angular_app' do
	command 'ng build'
	cwd '/home/ubuntu/angular'
end

# Setup nginx
cookbook_file "nginx-default" do
	path "/etc/nginx/sites-available/default"
end
execute 'nginx_reload_config' do
	command 'nginx -s reload'
end
