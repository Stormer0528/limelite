json.array! @checks, partial: "bank_accounts/checks/check", as: :item, locals: {bank_account: bank_account}
