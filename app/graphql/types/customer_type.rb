class Types::CustomerType < Types::BaseObject
  implements Interfaces::PayableInterface

  include Concerns::Permissable
  include Concerns::Phoneable

  field :id, ID, null: true
  field :name, String, null: true
  field :number, String, null: true
  field :full_name, String, null: true
  field :title, String, null: true
  field :first_name, String, null: true
  field :last_name, String, null: true
  field :middle_name, String, null: true
  field :suffix, String, null: true
  field :company, String, null: true
  field :email, String, null: true
  field :website, String, null: true
  field :notes, String, null: true
  field :visible_id, String, null: true
  field :path, String, null: true
  field :edit_path, String, null: true

  field :creator, Types::UserType, null: true

  # Relationships
  field :organization_id, String, null: false
  field :organization, Types::OrganizationType, null: false
  field :invoices, [Types::InvoiceType], null: false
  field :addresses, [Types::AddressType], null: false

  field :slug, String, null: true
  field :logo_url, String, null: true
  field :aasm_state, String, null: true
  field :display_name, String, null: true

  # Approval
  field :approved_at,    String,  null: true
  field :approver,       String,  null: true

  field :state_change_logs, [Types::StateChangeLogType], null: false

  def name
    object.name
  end

  def path
    "/customers/#{object.slug}"
  end

  def edit_path
    "/customers/#{object.slug}/edit"
  end

  def state_change_logs
    object.state_change_logs.order(updated_at: :desc)
  end

  def approved_at
    object.approved_at&.to_formatted_s(:long)
  end

  def approver
    object.approver_name
  end
end
