json.extract! vendor, :id, :name, :company, :notes, :aasm_state, :email, :other, :website, :account_number, :active, :payment_terms, :global, :ein, :name, :rating, :created_at, :updated_at
json.path vendor_path(vendor)
json.edit_path edit_vendor_path(vendor)

# Permissions
json.partial! 'shared/permissions', item: vendor

# Available Actions
json.partial! 'shared/standard_approval_actions', item: vendor
