json.extract! item, :id, :payee, :memo, :date, :amount, :amount_in_cents, :number, :aasm_state, :paper_check, :file_url, :created_at, :updated_at
json.amount item&.amount&.format(sign_before_symbol: true).to_s
json.icon class_icon("check", icon_options: "tiny")
