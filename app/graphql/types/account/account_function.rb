class Types::Account::AccountFunction < Types::BaseObject
  graphql_name "AccountFunction"
  include Concerns::Permissable
  implements Interfaces::AccountElementInterface
end
