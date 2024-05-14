class Types::Account::AccountYear < Types::BaseObject
  graphql_name "AccountYear"
  include Concerns::Permissable
  implements Interfaces::AccountElementInterface
end
