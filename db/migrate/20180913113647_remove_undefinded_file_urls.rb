class RemoveUndefindedFileUrls < ActiveRecord::Migration[5.1]
  def up
    [Payment, Invoice, PurchaseOrder, BankAccount::Item, Vendor, Statement].each do |model|
      model.where(file_url: "undefined").update_all(file_url: nil)
    end

    [Vendor, Customer].each do |model|
      model.where(logo_url: "undefined").update_all(logo_url: nil)
    end
    Entry.where(backup_file_url: "undefined").update_all(backup_file_url: nil)
    User.where(avatar_url: "undefined").update_all(avatar_url: nil)
  end
end
