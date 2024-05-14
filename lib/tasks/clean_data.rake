# NOTE: only doing this in development as some production environments (Heroku)
# NOTE: are sensitive to local FS writes, and besides -- it's just not proper
# NOTE: to have a dev-mode tool do its thing in production.
if Rails.env.development?
  task :users do
    #Destroy the users
    User.where(id: 1..183).destroy_all
  end

  task :organization do

    # Set the org variable
    # org = Organization.find

    CreditCard::Item.joins(:credit_card).where("credit_cards.organization_id = ?", org.id).each do |item|
      item.update(entry_id: nil)
    end 
    CreditCard::Item.joins(:credit_card).where("credit_cards.organization_id = ?", org.id).destroy_all
    BankAccount::Item.joins(:bank_account).where("bank_accounts.organization_id = ?", org.id).destroy_all
    BankAccount.where(organization_id: org.id).destroy_all
    CreditCard.where(organization_id: org.id).destroy_all
    Statement.where(organization_id: org.id).destroy_all

    Entry.where(organization_id: org.id).destroy_all

    AccountFund.where(organization_id: org.id).destroy_all
    AccountResource.where(organization_id: org.id).destroy_all
    AccountYear.where(organization_id: org.id).destroy_all
    AccountGoal.where(organization_id: org.id).destroy_all
    AccountFunction.where(organization_id: org.id).destroy_all
    AccountObject.where(organization_id: org.id).destroy_all
    AccountLocation.where(organization_id: org.id).destroy_all

    Invoice.where(organization_id: org.id).destroy_all
    PurchaseOrder.where(organization_id: org.id).destroy_all

    Vendor.where(organization_id: org.id).destroy_all
    Customer.where(organization_id: org.id).destroy_all

    BatchUpload.where(organization_id: org.id).destroy_all

    OrganizationAssignment.where(organization_id: org.id).destroy_all

    org.destroy!
  end

  task :old_fund do
    AccountFund.where(code: "62").each do |fund|
      fund.destroy

    rescue ActiveRecord::InvalidForeignKey
      next
    end
  end
end
