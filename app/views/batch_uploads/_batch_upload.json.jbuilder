json.extract! batch_upload, :id, :total_invoices, :critical_invoices, :notes, :creator_id, :aasm_state, :created_at, :updated_at
json.url batch_upload_url(batch_upload, format: :json)
