json.array!(@bank_accounts) do |bank_account|
  json.partial! "bank_accounts/bank_account", bank_account: bank_account
end

