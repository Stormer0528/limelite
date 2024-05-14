APP_VERSION = YAML.load_file("#{Rails.root.to_s}/config/app_version.yml")[Rails.env]
