class Unions::InvoiceableUnion < Unions::BaseUnion
  graphql_name "InvoiceableUnion"
  description "Classes that can be invoiced"
  possible_types Types::CustomerType, Types::Vendor

  def self.resolve_type(object, _ctx)
    if object.is_a?(Customer)
      Types::CustomerType
    elsif object.is_a?(Vendor)
      Types::Vendor
    else
      "Types::#{object.class.name}".safe_constantize
    end
  end
end
