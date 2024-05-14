# NOTE: only doing this in development as some production environments (Heroku)
# NOTE: are sensitive to local FS writes, and besides -- it's just not proper
# NOTE: to have a dev-mode tool do its thing in production.
if Rails.env.development?
  task :move do
    # You can override any of these by setting an environment variable of the
    # same name.

    updated_debits = []

    BankAccount::Check.joins(:payments).find_each do |check|
      payment = check.payments.first
      check.entry.debits.each do |debit|
        next unless debit.account_object_code == "9500" && debit.payment.blank?

        debit.build_payment(
          payment.attributes.slice(
            "invoice_id", "date", "payable_type", "payable_id", "address_id",
            "creator_id", "bank_account_item_id"
          )
        )
        debit.save!
        updated_debits << debit.id
      end
    end

    puts updated_debits
  end

  task :fix do
    bad_payments = []

    Payment.all.find_each do |payment|
      current_item = payment.entry_item
      bad_payments << payment.id unless current_item
      next unless current_item&.type == "Debit"

      current_account = current_item.account
      account_object_id = payment.check.bank_account.account_object_id

      new_account = Account.find_or_create_by(
        organization_id:     current_account.organization_id,
        account_fund_id:     current_account.account_fund_id,
        account_resource_id: current_account.account_resource_id,
        account_year_id:     current_account.account_year_id,
        account_goal_id:     current_account.account_goal_id,
        account_function_id: current_account.account_function_id,
        account_object_id:   account_object_id,
        account_location_id: current_account.account_location_id
      )

      new_item = payment.entry.credits.find_by(
        amount_in_cents: current_item.amount_in_cents, account: new_account
      )

      bad_payments << payment.id unless new_item
      next unless new_item

      payment.update_columns(entry_item_id: new_item.id)
    end

    puts bad_payments
  end
end
