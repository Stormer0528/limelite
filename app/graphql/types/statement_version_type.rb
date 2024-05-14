class Types::StatementVersionType < Types::StatementType
  field :id, ID, null: true
  field :data, String, null: false
  field :statement, Types::StatementType, null: false
  field :version, Integer, null: false
  field :audit_version, Integer, null: false
  field :starting_balance_in_cents, Integer, null: false
  field :adjustment_amount_in_cents, Integer, null: false

  field :created_at, String, null: true
  field :updated_at, String, null: true
  field :associated_items, String, null: true

  # Methods
  #-----------------------------------------------------------------------------
  def created_at
    object.created_at&.to_date&.to_formatted_s("Y-m-d")
  end

  def updated_at
    object.updated_at&.to_date&.to_formatted_s("Y-m-d")
  end

  def edit_path
    nil
  end

  def version
    object.audit_version
  end

  def audit
    object.audits.find_by version: version
  end

  def associated_items
    audit.associated_items.to_json
  end

  def versions
    []
  end

  def path
    [super, "versions", object.audit_version].join("/")
  end
end
