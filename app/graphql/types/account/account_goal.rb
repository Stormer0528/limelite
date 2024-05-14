class Types::Account::AccountGoal < Types::BaseObject
  graphql_name "AccountGoal"
  include Concerns::Permissable
  implements Interfaces::AccountElementInterface
end
