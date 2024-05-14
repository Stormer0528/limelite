class JsScaffoldGenerator < Rails::Generators::NamedBase
  source_root File.expand_path("templates", __dir__)

  desc "rails g js_scaffold PATH"

  # SHOULD:
  #
  # 1. copy react views index, new, edit, show ✅
  # 2. copy react-formik form
  # 3. copy routes and breadcrumb ✅
  # 4. copy graphql queries
  #   -- optionally: get graphql type and include fields in queries
  # 5. copy graphql mutations
  # 6. create tests for views
  # 7. create tests for routes
  # 8. create graphql mutation models
  # 9. create graphql input objects
  # 10. update QueryType and MutationType with fields

  def copy_templates
    base_path = "app/javascript/components/"
    graphql_path = "app/javascript/graphql/"
    @model_name = file_name.singularize.camelize # E.g. PurchaseOrder or Vendor
    @model_prefix = file_name.singularize.camelize(:lower) # e.g. #{prefix}Id => purchaseOrderId
    @graphql_model = "Types::#{@file_name.classify}Type".safe_constantize || "Types::#{@file_name.classify}".safe_constantize
    @file_dots = "../" * (@name.split("/").length + 1) # e.g. ../../

    ["index_view", "show_view", "edit_view", "new_view"].each do |view|
      template  "views/index.js", [base_path, @name, view, "index.js"].join("/"), *args
      template  "views/view.js.erb", [base_path, @name, view, "view.js"].join("/"), *args

      case view
      when "show_view"
        template "views/navlinks.show.js.erb", [base_path, @name, view, "navlinks.js"].join("/"), *args
      when "edit_view"
        template "views/navlinks.edit.js.erb", [base_path, @name, view, "navlinks.js"].join("/"), *args
      end
    end

    template "form.js.erb", [base_path, @name, "form/index.js"].join("/"), *args
    template "api.js.erb", [base_path, @name, "api.js"].join("/"), *args
    template "routes.js.erb", [base_path, @name, "routes.js"].join("/"), *args
    template "breadcrumb.js.erb", [base_path, @name, "breadcrumb.js"].join("/"), *args

    # GQL
    template "graphql/query.erb.gql", [graphql_path, "queries", "load_#{@file_name.singularize.underscore}.gql"].join("/"), *args

    create_file [graphql_path, "mutations", file_name, "create_#{@file_name.singularize.underscore}.gql"].join("/"), *args
    create_file [graphql_path, "mutations", file_name, "update_#{@file_name.singularize.underscore}.gql"].join("/"), *args
    template "graphql/delete_mutation.gql.erb", [graphql_path, "mutations", file_name, "destroy_#{@file_name.singularize.underscore}.gql"].join("/"), *args

    # Tests
    template "stories.js.erb", [base_path, @name, "#{file_name}.stories.js"].join("/"), *args
    template "test.js.erb",    [base_path, @name, "#{file_name}.test.js"].join("/"), *args
  end
end
