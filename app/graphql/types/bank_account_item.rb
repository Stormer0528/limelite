Types::BankAccountItem = GraphQL::ObjectType.define do
  name "BankAccountItem"
  interfaces [Interfaces::BankItemInterface]
end
