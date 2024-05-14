class Unions::PayableUnion < Unions::BaseUnion
  graphql_name "PayableUnion"
  description "Entities which can recieve a payment"
  possible_types Types::CustomerType, Types::Vendor

  def self.resolve_type(object, _ctx)
    if object.is_a?(Vendor)
      Types::Vendor
    elsif object.is_a?(Customer)
      Types::CustomerType
    end
  end
end
