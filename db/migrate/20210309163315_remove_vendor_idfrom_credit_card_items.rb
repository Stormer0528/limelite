class RemoveVendorIdfromCreditCardItems < ActiveRecord::Migration[5.2]
  def change
    remove_reference(:credit_card_items, :vendor, foreign_key: true)
  end
end
