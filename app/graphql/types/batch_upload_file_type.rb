class Types::BatchUploadFileType < Types::BaseObject
  field :handle, String, null: true
  field :url, String, null: true
  field :uploadId, String, null: true
  field :accounts, [BatchUploadAccountType], null: false
  field :amount, Float, null: false
  field :vendorId, ID, null: true
  field :vendorName, String, null: true
  field :notes, String, null: true
  field :amount, Float, null: true
  field :invoiceNumber, String, null: true
  field :approved, Boolean, null: true
  field :path, String, null: true
  field :reason, String, null: true
  field :date, String, null: true
  field :due_date, String, null: true
  field :invoice_number, String, null: true

  def amount
    object["accounts"].map {|acc| acc["amount"] }.inject(0.0) {|total, amt| total + amt }
  end

  def invoice_number
    object["invoice_number"] || ""
  end

  def notes
    object["notes"] || ""
  end

  def reason
    object["reason"] || ""
  end

  def approved
    if object["path"] == "#" && (
        context[:current_user_group].approval_amount.zero? ||
        context[:current_user_group].approval_amount >= object["amount"] * 100
      )
      nil
    else
      object["approved"]
    end
  end

  def path
    if object["path"] == "#" && (
        context[:current_user_group].approval_amount.zero? ||
        context[:current_user_group].approval_amount >= object["amount"] * 100
      )
      nil
    else
      object["path"]
    end
  end
end
