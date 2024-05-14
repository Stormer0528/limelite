json.extract! item, :id, :memo, :date, :amount_in_cents, :number, :aasm_state, :vendor_id
json.payee item.payee || ""
json.vendor item&.vendor&.name || ""
json.type item.name || ""
json.reconciled item.reconciled?

json.amount item.amount.format(sign_before_symbol: true).to_s
json.credit ['deposit', 'to_account_transfer'].include?(item.type_name(bank_account)) ? item.amount.format(sign_before_symbol: true).to_s : ""
json.debit  ['check', 'from_account_transfer'].include?(item.type_name(bank_account)) ? item.amount.format(sign_before_symbol: true).to_s : ""

json.icon class_icon(item.name, icon_options: "tiny")
json.edit_path send("edit_bank_account_#{item.name}_path", bank_account, item)

# Permissions
json.partial! 'shared/permissions', item: item

# Entry
json.entry do
  json.partial! "entries/entry", entry: item.entry if item.entry
end
