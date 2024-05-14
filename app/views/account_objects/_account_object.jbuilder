json.extract! account_object, :id, :created_at, :updated_at, :code, :name
json.url account_object_url(account_object, format: :json)
