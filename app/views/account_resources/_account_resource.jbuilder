json.extract! account_resource, :id, :created_at, :updated_at, :code, :name
json.url account_resource_url(account_resource, format: :json)
