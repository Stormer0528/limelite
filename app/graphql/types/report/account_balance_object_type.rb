class Types::Report::AccountBalanceObjectType < Types::Account::AccountObject
  graphql_name "AccountBalanceObjectType"
  field :balances, [String], null: true
  field :balance, String, null: true

  def balances
    object["balances"]
  end
  
  def balance
    object["balance"]
  end
end
