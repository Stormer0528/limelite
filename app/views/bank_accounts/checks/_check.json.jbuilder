json.extract! check, :id, :account_id, :amount, :date, :memo, :number, :printed, :file_url, :created_at, :updated_at
json.url check_url(check, format: :json)
