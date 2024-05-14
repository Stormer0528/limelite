class SwitchPaymentCheckRelationship < ActiveRecord::Migration[5.1]
  def up
    add_reference :payments, :bank_account_item
    add_reference :payments, :entry_item

    # Loop through checks add check.id to payment
    BankAccount::Check.where.not(payment_id: nil).find_each(batch_size: 250) do |check|
      payment = Payment.find(check.payment_id)
      payment.update_columns bank_account_item_id: check.id
      check.entry.debits.each do |debit|
        if debit.account_object_code == "9500"
          payment.update entry_item_id: debit.id
        else
          puts "No entry_item for Check id: #{check.id}, Payment id: #{payment.id}"
        end
      end
    end
  end

  def down
    remove_reference :payments, :bank_account_item
    remove_reference :payments, :entry_item
  end
end
