json.array!(@accounts) do |account|
  json.cache! account.cache_key, expires_in: 4.hours do
    json.partial! "accounts/account", account: account, hide_balance: local_assigns.dig(:hide_balance)
  end
end
