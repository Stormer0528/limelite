namespace :db do
  task truncate: :environment do
    if Rails.env.test?
      DatabaseCleaner.clean_with :truncation
    else
      system("bundle exec rails db:truncate RAILS_ENV='test'")
      raise if $?.exitstatus.nonzero?
    end
  end

  namespace :seed do
    Dir[File.join(Rails.root, "db", "seeds", "*.rb")].each do |filename|
      task_name = File.basename(filename, ".rb").intern
      task task_name => :environment do
        load(filename) if File.exist?(filename)
      end
    end
  end
end
