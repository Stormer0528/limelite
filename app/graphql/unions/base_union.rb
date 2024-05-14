class Unions::BaseUnion < GraphQL::Schema::Union

  def self.resolve_type(object, _ctx)
    "Types::#{object.class.name}".safe_constantize
  end
end
