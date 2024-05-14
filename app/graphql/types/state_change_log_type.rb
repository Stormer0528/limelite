class Types::StateChangeLogType < Types::BaseObject
  field :id,            ID,     null: false
  field :user_id,       ID,     null: false
  field :loggable_type, String, null: true
  field :loggable_id,   ID,     null: false
  field :reason,        String, null: true
  field :from_state,    String, null: true
  field :to_state,      String, null: true
  field :created_at,    String, null: true
  field :updated_at,    String, null: true
  field :event,         String, null: true
  field :date_time,     String, null: true
  field :user,          Types::UserType, null: true
  field :invoice,       Types::InvoiceType, null: true

  def from_state
    object.from_state&.titleize
  end

  def to_state
    object.to_state&.titleize
  end

  def loggable_type
    object.loggable_type&.titleize
  end

  def created_at
    object.created_at&.to_date&.to_formatted_s(:iso)
  end

  def updated_at
    object.updated_at&.to_date&.to_formatted_s(:iso)
  end

  def date_time
    object.updated_at&.to_formatted_s(:iso)
  end
end
