class Types::Vendor < Types::BaseObject
  implements Interfaces::PayableInterface

  include Concerns::Permissable
  include Concerns::Phoneable

  field :id,              ID,      null: true
  field :name,            String,  null: true
  field :full_name,       String,  null: true
  field :display_name,    String,  null: true
  field :visible_id,      String,  null: true
  field :company,         String,  null: true
  field :notes,           String,  null: true
  field :email,           String,  null: true
  field :other,           String,  null: true
  field :website,         String,  null: true
  field :account_number,  String,  null: true
  field :active,          Boolean, null: true
  field :payment_terms,   String,  null: true
  field :global,          Boolean, null: true
  field :rating,          Integer, null: true
  field :created_at,      String,  null: true
  field :updated_at,      String,  null: true
  field :title,           String,  null: true
  field :first_name,      String,  null: true
  field :middle_name,     String,  null: true
  field :last_name,       String,  null: true
  field :primary_phone,       String,  null: true
  field :suffix,          String,  null: true
  field :organization_id, ID,      null: true
  field :slug,            String,  null: true
  field :logo_url,        String,  null: true
  field :aasm_state,      String,  null: true
  field :path,            String,  null: true
  field :edit_path,       String,  null: true

  field :creator, Types::UserType, null: true

  field :starting_balance, String, null: true
  field :start_date,       String, null: true
  field :end_date,         String, null: true

  # Approval
  field :approved_at,    String,  null: true
  field :approver,       String,  null: true

  # Relationships
  field :organization_id, String, null: false
  field :organization, Types::OrganizationType, null: false
  field :invoices, [Types::InvoiceType], null: false
  field :addresses, [Types::AddressType], null: false
  field :ten_ninety_nines, [Types::TenNinetyNineType], null: false
  field :current_ten_ninety_nine, Types::TenNinetyNineType, null: true
  field :state_change_logs, [Types::StateChangeLogType], null: false
  field :file_uploads, [Types::FileUploadType], null: false

  field :default_po_number, String, null: false

  def approved_at
    object.approved_at&.to_formatted_s(:long)
  end

  def approver
    object.approver_name
  end

  def path
    "/vendors/#{object.slug}"
  end

  def edit_path
    "/vendors/#{object.slug}/edit"
  end

  def url
    path
  end

  def edit_url
    edit_path
  end

  def state_change_logs
    object.state_change_logs.order(updated_at: :desc)
  end

  def starting_balance
    object&.starting_balance&.format
  end

  def start_date
    object&.start_date&.to_formatted_s(:std)
  end

  def end_date
    object.end_date&.to_formatted_s(:std)
  end

  def default_po_number
    [context[:fiscal_year]&.year, (object.purchase_orders.count + 1).to_s.rjust(3, "0")].join("-")
  end
end
