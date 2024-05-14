# Invoke with
# GraphqL IDL:
#   rails graphql:dump_schema_idl
# JSON:
#   rails graphql:dump_schema_idl

# Updated with comment from https://github.com/rmosolgo/graphql-ruby/issues/2501#issuecomment-590691058
namespace :graphql do
  task dump_schema_idl: :environment do
    require "graphql/rake_task"

    GraphQL::RakeTask.new(
      load_schema: ->(_task) {
        require File.expand_path("../../app/graphql/savant_co_schema", __dir__)
        SavantCoSchema
      },
      directory: "."
    )
    Rake::Task["graphql:schema:idl"].invoke
  end

  task dump_schema_json: :environment do
    require "graphql/rake_task"

    GraphQL::RakeTask.new(
      load_schema: ->(_task) {
        require File.expand_path("../../app/graphql/savant_co_schema", __dir__)
        SavantCoSchema
      },
      directory: "."
    )
    Rake::Task["graphql:schema:json"].invoke
  end
end
