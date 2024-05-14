class ReducerGenerator < Rails::Generators::NamedBase
  source_root File.expand_path("../templates", __FILE__)

  desc "rails generate reducer NAME [options] Action1 Action2 ..."

  def copy_templates
    template "reducer.js", "app/javascript/reducers/#{file_name}_reducer.js", *args
    template "actions.js", "app/javascript/actions/#{file_name}_actions.js", *args
  end
end
