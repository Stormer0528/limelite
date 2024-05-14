class Types::StatementType < Types::BaseObject
  include Concerns::Permissable

  field :id, ID, null: false
  field :started_at, String, null: true
  field :ended_at,   String, null: true

  field :started_at_formatted, String, null: true
  field :ended_at_formatted,   String, null: true

  field :file_url, String, null: true
  field :aasm_state, String, null: true

  field :starting_balance, String, null: true
  field :ending_balance, String, null: true
  field :adjustment_amount, String, null: true
  field :adjustment_date, String, null: true

  field :organization, Types::OrganizationType, null: true
  field :organization_id, ID, null: true

  field :statementable_id, ID, null: true
  field :statementable_type, String, null: true
  field :statementable, Unions::StatementableUnion, null: true

  field :reconciliations, [Types::ReconciliationType, null: true], null: true

  field :items, [Unions::StatementItemUnion, null: true], null: true
  field :unreconciled_items, [Unions::StatementItemUnion, null: true], null: true
  field :creator, Types::UserType, null: true
  field :approver, Types::UserType, null: true

  field :creator_name, String, null: true
  field :approver_name, String, null: true

  field :approved, Boolean, null: true

  field :path, String, null: true
  field :edit_path, String, null: true
  field :export_path, String, null: true

  field :created_at, String, null: true
  field :updated_at, String, null: true

  field :audits, [Types::AuditType, null: true], null: false

  # Methods
  #-----------------------------------------------------------------------------
  def started_at
    object.started_at&.to_date&.to_formatted_s("Y-m-d")
  end

  def ended_at
    object.ended_at&.to_date&.to_formatted_s("Y-m-d")
  end

  def started_at_formatted
    object.started_at&.to_date&.to_formatted_s(:std)
  end

  def ended_at_formatted
    object.ended_at&.to_date&.to_formatted_s(:std)
  end

  def items
    object.bank_account_items.includes(:address, payments: :invoice) +
      object.credit_card_items
  end

  def creator_name
    object&.creator&.full_name
  end

  def approved
    object.approved?
  end

  def ending_balance
    object&.ending_balance&.format
  end

  def versions
    object.audits
  end

  def path
    return nil unless object.statementable

    statementable = object.statementable_type&.underscore&.pluralize
    slug = object.statementable&.slug
    "/#{statementable}/#{slug}/reconciliations/#{object.id}"
  end

  def edit_path
    "#{path}/edit"
  end

  def export_path
    "#{path}/export.xlsx"
  end
end
