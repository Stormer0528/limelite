json.extract! bank_account_item, :id, :bank_account_id, :amount, :date, :memo, :creator_id, :payee, :vendor_id, :aasm_state, :created_at, :updated_at
json.reconciled bank_account_item.reconciled?
jsoon.account
jsoon.account_title
json.url bank_account_item_url(bank_account_item, format: :json)
