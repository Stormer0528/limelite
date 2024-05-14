class FragmentsJsonGenerator < Rails::Generators::NamedBase
  source_root File.expand_path("templates", __dir__)
  desc "rails generate fragments_json UPDATE"

  def copy_templates
    query_result = SavantCoSchema.execute """
    {
      __schema {
        types {
          kind
          name
          possibleTypes {
            name
          }
        }
      }
    }
    """
    types = query_result.to_h["data"]["__schema"]["types"].select {|t| t["possibleTypes"] }

    query_result.to_h["data"]["__schema"]["types"] = types
    @content = JSON.pretty_generate(query_result["data"])

    template "fragments.js.erb", "app/javascript/fragments.json", *args
  end
end
