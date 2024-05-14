class AddLimitToCreditCardAccount < ActiveRecord::Migration[5.1]
  def change
    add_monetize :credit_card_accounts, :limit
  end
end
