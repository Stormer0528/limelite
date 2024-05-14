class AddPaymentEntriesToBankAcountItems < ActiveRecord::Migration[5.1]
  def change
    BankAccount::Item.where.not(payment_id: nil).where(entry_id: nil).each do |item|
        item.update!(entry_id: item.payment&.entry&.id)
    end
  end
end
