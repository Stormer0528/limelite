class Mutations::BaseMutation < GraphQL::Schema::Mutation
  object_class Types::BaseObject
  # This is used for return fields on the mutation's payload
  field_class Types::BaseField
  # This is used for generating the `input: { ... }` object type
  # input_object_class Types::BaseInputObject
end
