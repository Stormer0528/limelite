module Graphql
  module Generators
    class ResolverGenerator < Rails::Generators::NamedBase
      source_root File.expand_path('../templates', __FILE__)
      namespace 'graphql'
      desc "rails generate graphql:resolver NAME [options] attribute:type"

      def copy_templates
        template "#{file_name}_resolver.rb", "app/graphql/resolvers/#{file_name}_resolver.rb", *args
      end

      def normalized_fields
        @normalized_fields ||= fields.map { |f|
          name, raw_type = f.split(":", 2)
          type_expr, null = "types.#{raw_type.classify}"
          NormalizedField.new(name, type_expr, null)
        }
      end

      class NormalizedField
        def initialize(name, type_expr, null)
          @name = name
          @type_expr = type_expr
          @null = null
        end

        def to_ruby
          "option :#{@name}, #{@type_expr}, null: #{@null}"
        end
      end
    end
  end
end
