class Types::Account::AccountLocation < Types::BaseObject
  graphql_name "AccountLocation"
  include Concerns::Permissable
  implements Interfaces::AccountElementInterface
end
