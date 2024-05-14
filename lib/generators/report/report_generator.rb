module Reports
  module Generators
    class ReportGenerator < Rails::Generators::NamedBase
      namespace 'report'

      source_root File.expand_path("../templates", __FILE__)
      desc "rails generate report NAME"

      def copy_templates
        # template "reducer.js", "app/javascript/reducers/#{file_name}_reducer.js", *args
        # template "actions.js", "app/javascript/actions/#{file_name}_actions.js", *args
      end

      # inject_into_file "config/routes.rb", after: "namespace :export do" do <<-'ROUTE'
      #   resource :#{file_name},
      #            only: %i[show update destroy],
      #            path:   \"#{file_name.dasherize}\"
      # ROUTE
      # end
    end
  end
end
