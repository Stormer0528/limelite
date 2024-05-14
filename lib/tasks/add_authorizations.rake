namespace :authorizations do
  task add_vendors: :environment do
    puts "Rake Task: Add Authorizations"

    puts "Vendors:"
    Vendor.where(aasm_state: [:draft, :needs_approval, :needs_revision]).each do |vendor|
      vendor.creator = vendor.state_change_logs&.first&.user
      vendor.save!
    end
  end

  task add_invoices: :environment do
    Invoice.where(aasm_state: [:draft, :needs_approval, :needs_revision]).each do |invoice|
      invoice.creator = invoice.state_change_logs.first&.user
      puts invoice.creator
      invoice.save!
    end
  end

  task delete_auths: :environment do
    Authorization.where(user_id: nil).each do |authorization|
      if authorization.authorizable.nil? || ['approved','printed','voided'].include?(authorization.authorizable.aasm_state)
        authorization.destroy!
      end
    end
  end

  task update_invoices: :environment do
    Invoice.joins(:entry).where("invoices.aasm_state != entries.aasm_state").each do |invoice|
      if invoice.aasm_state != "approved" && invoice.entry.aasm_state == "approved"
      invoice.update(aasm_state: "approved")
      end
      if invoice.aasm_state == "approved" && invoice.entry.aasm_state != "approved"
        invoice.entry.update(aasm_state: "approved")
      end
    end
  end

  task update_items: :environment do
    BankAccount::Item.joins(:entry).where.not(aasm_state: [:printed, :voided]).where("bank_account_items.aasm_state !=  entries.aasm_state").each do |item|
      if item.entry.aasm_state == "approved"
        item.update(aasm_state: "approved")
      end
      if item.aasm_state == "approved"
        item.entry.update(aasm_state: "approved")
      end
    end
  end
end