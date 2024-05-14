class JsIconsGenerator < Rails::Generators::NamedBase
  source_root File.expand_path("templates", __dir__)

  desc ["rails g js_icons", "", "Copies all of the class icons as import files for MUI icons"].join("\n")

  # SHOULD:

  def copy_templates
    base_path = "app/javascript/components/shared/icons"

    IconHelper::ICON_MAP.each do |fname, icon_name|
      @icon_name = fname.to_s.camelize
      @icon_class = icon_name.camelize
      template "./icon.js.erb", [base_path, "#{fname}_icon.js"].join("/"), *args
    end
  end
end
