source "https://rubygems.org"

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?("/")
  "https://github.com/#{repo_name}.git"
end

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem "rails", "~> 5.2.4.4"
# Use sqlite3 as the database for Active Record
gem "pg", "~> 1.0"
# Use Puma as the app server
gem "puma", "~> 5.0"
# Use SCSS for stylesheets
gem "sass-rails", "~> 6.0"
# Use Uglifier as compressor for JavaScript assets
gem "uglifier", ">= 1.3.0"
# Transpile app-like JavaScript. Read more: https://github.com/rails/webpacker
# webpacker 6 requires upgrade in webpack
gem "webpacker", "~> 5.x"

# See https://github.com/rails/execjs#readme for more supported runtimes
# gem 'therubyracer', platforms: :ruby

# Use jquery as the JavaScript library
gem "jquery-rails"
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem "jbuilder", "~> 2.5"
# Use Redis adapter to run Action Cable in production
# gem 'redis', '~> 3.0'
# Use ActiveModel has_secure_password
# gem 'bcrypt', '~> 3.1.7'

# Use slim for lightweight hmtl
gem "slim-rails"

# Change tracking
gem "audited", "~> 4.9"

gem "devise"
gem "friendly_id"
gem "simple_form"

# Date Parsing
gem "chronic"

gem "numbers_and_words"

gem "material_icons"
gem "materialize-sass", "~> 1.0.0"

gem "repost"

# Generate Fake Data
gem "faker", "~> 2.14.0"

# Permissions
gem "pundit"

gem "dotenv-rails"

# Excel Imports
gem "rubyzip", ">= 1.2.1"
gem "caxlsx"
gem "caxlsx_rails"
gem "rubyXL"

# Phone # validation
gem "phony_rails"

gem "activerecord_json_validator"

# Currency Parsing/Validation
gem "money-rails", "~>1"

# file uploads
gem "filestack-rails", "~>5.4"

gem "aasm"

# Dynamic fields
gem "cocoon"

# GraphQL
gem "graphql", "~>1.9.1"

gem "graphiql-rails"
gem "graphql-batch"
gem "graphql-errors"
gem "graphql-guard"
gem "graphql-preload"
gem "graphql-sugar"

gem "search_object_graphql", "~> 0.3.2"

# Pages to PDF
gem "wicked_pdf"
gem "wkhtmltopdf-binary", "= 0.12.3.1"

gem "strong_password", "~> 0.0.6"
gem "zxcvbn-ruby", require: "zxcvbn"

# Reduces boot times through caching; required in config/boot.rb
gem "bootsnap", ">= 1.1.0", require: false

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem "byebug", platform: :mri
  gem "rb-readline"

  # Testing with Rspec
  gem "factory_bot_rails"
  gem "rspec-rails", "~> 4.0"

  # Autorun things
  gem "amazing_print"
  # gem "guard-rspec", require: false
  # gem "guard-spring"
  # gem "parallel_tests"
  gem "rails-controller-testing"
  # gem "rb-fsevent" if `uname` =~ /Darwin/
  gem "shoulda-matchers", "~> 4.5"
  gem "spring-commands-rspec"
end

group :development do
  # Use Capistrano for deployment
  gem "capistrano", "~> 3.11", require: false
  gem "capistrano-passenger", require: false
  gem "capistrano-rails", "~> 1.4", require: false
  gem "capistrano-rbenv", "~> 2.1", require: false

  # For VsCode syntax checking
  gem "solargraph"

  gem "listen", "~> 3.2.1"
  gem "parser" # for graphql Upgrade tasks
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem "spring"
  gem "spring-watcher-listen", "~> 2.0.0"

  # Use pry for rails console
  gem "pry", "~> 0.13.0"
  gem "pry-byebug"
  gem "pry-clipboard"
  gem "pry-rails"
  gem "pry-stack_explorer"
  gem "debase", "~> 0.2.4.1"
  gem "ruby-debug-ide", "~> 0.7.2"

  # Better Error Pages than web console
  gem "better_errors", "~> 2.5"
  gem "binding_of_caller"

  # ERD
  gem "rails-erd"

  # Allow usage of rails tab for chrome dev tools
  gem "meta_request"

  # Auto-document database tables in models
  gem "annotate"

  # pretty-up console output
  gem "awesome_print"

  # Guard as task runner
  gem "fuubar"

  gem "bullet"

  # Profile page load time
  gem "seed_dump"

  gem "rubocop"
  # gem "solargraph"
end

group :test do
  gem "database_cleaner", "~> 1.5"
  gem "launchy", "~> 2.4.2"
  gem "nyan-cat-formatter"
  gem "pundit-matchers", "~> 1.6.0"
  gem "simplecov", require: false
end

group :production do
  gem "rails_12factor"
  # gem 'wkhtmltopdf-heroku'
end
