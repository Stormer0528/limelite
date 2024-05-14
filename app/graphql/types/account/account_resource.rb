class Types::Account::AccountResource < Types::BaseObject
  graphql_name "AccountResource"
  include Concerns::Permissable
  implements Interfaces::AccountElementInterface
end
