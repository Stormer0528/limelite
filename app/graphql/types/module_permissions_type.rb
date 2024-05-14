module Types
  class ModulePermissionsType < Types::BaseObject
    field :Report, String, null: true
    field :Vendor, String, null: true
    field :Account, String, null: true
    field :Customer, String, null: true
    field :CreditCard, String, null: true
    field :BankAccount, String, null: true
    field :BatchUpload, String, null: true
    field :approval_amount, Integer, null: true

    def approval_amount
      object["approval_amount"] || 0
    end

    def report
      object["Report"]
    end

    def vendor
      object["Vendor"]
    end

    def account
      object["Account"]
    end

    def customer
      object["Customer"]
    end

    def credit_card
      object["CreditCard"]
    end

    def bank_account
      object["BankAccount"]
    end

    def batch_upload
      object["BatchUpload"]
    end
  end
end
