class Unions::AuthorizableUnion < Unions::BaseUnion
  graphql_name "AuthorizableUnion"
  description "Items that can be authorized"
  possible_types Types::PurchaseOrderType,
                 Types::BatchUploadType,
                 Types::InvoiceType,
                 Types::CustomerType,
                 Types::Vendor,
                 Types::EntryType,
                 Types::DepositType,
                 Types::CheckType,
                 Types::AccountTransferType,
                 Types::CreditCardChargeType,
                 Types::CreditCardPaymentType,
                 Types::DenialNotificationType

  def self.resolve_type(obj, _ctx)
    case obj.class.name
    when "Invoice"
      Types::InvoiceType
    when "Customer"
      Types::CustomerType
    when "Vendor"
      Types::Vendor
    when "PurchaseOrder"
      Types::PurchaseOrderType
    when "BatchUpload"
      Types::BatchUploadType
    when "Entry"
      Types::EntryType
    when "BankAccount::Deposit"
      Types::DepositType
    when "BankAccount::Check"
      Types::CheckType
    when "BankAccount::AccountTransfer"
      Types::AccountTransferType
    when "CreditCard::Charge"
      Types::CreditCardChargeType
    when "CreditCard::Payment"
      Types::CreditCardPaymentType
    when "DenialNotification"
      Types::DenialNotificationType
    end
  end
end
