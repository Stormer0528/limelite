class Types::Account::AccountFund < Types::BaseObject
  graphql_name "AccountFund"
  include Concerns::Permissable
  implements Interfaces::AccountElementInterface
end
