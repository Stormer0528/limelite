json.extract! customer, :id, :title, :first_name, :last_name, :middle_name, :suffix, :company, :email, :website, :notes, :created_at, :updated_at
json.url customer_url(customer, format: :json)
json.path vendor_path(customer)
json.edit_path edit_vendor_path(customer)

# Permissions
json.partial! 'shared/permissions', item: customer

# Available Actions
json.partial! 'shared/standard_approval_actions', item: customer
