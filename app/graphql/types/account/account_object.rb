class Types::Account::AccountObject < Types::BaseObject
  graphql_name "AccountObject"
  include Concerns::Permissable
  implements Interfaces::AccountElementInterface

  field :normal_balance, String, null: false
end
