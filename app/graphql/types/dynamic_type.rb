# model_to_type = {}
#
# def create_type(model_class)
#   GraphQL::ObjectType.define do
#     name(model_class.name)
#     description("Generated programmatically from model: #{model_class.name}")
#     # Make a field for each column:
#     model_class.columns.each do |column|
#       field(column.name, convert_type(column.type))
#     end
#     # Make a field for associations
#     model_class.associations.each do |association|
#       # The proc will be eval'd later - by that time, there will be a type in the lookup hash
#       field(association.name, -> { model_to_type[association.associated_model] })
#     end
#   end
# end
#
# # Create Dynamic Models
# #-----------------------------------------------------------------------------
#
# # Create Types
# dynamic_models = [EntryItem, Entry]
# dynamic_models.each {|model_class| model_to_type[model_class] = create_type(model_class) }
#
# # Create generic functions to lookup all in current org or a single item
# dynamic_models.each do |model_class|
#   # Find single model
#   type model_class.name.underscore.to_sym do
#     type model_to_type[model_class]
#     description "Find #{model_class.name} By ID"
#     argument :id, !types.ID
#     resolve ->(_obj, _args, context) {
#       return {} unless context[:current_org]
#       context[:current_org].send(model_class.name.underscore.pluralize.to_sym).find(args["id"])
#     }
#   end
#
#   # find all models of type
#   type model_class.name.underscore.pluralize.to_sym do
#     types [MODEL_TO_TYPE[model_class]]
#     description "Find #{model_class.name.pluralize} for current Organization"
#     resolve ->(_obj, _args, context) {
#       return {} unless context[:current_org]
#       context[:current_org].send(model_class.name.underscore.pluralize.to_sym)
#     }
#   end
# end
