class Types::AuditType < Types::BaseObject
  field :id, ID, null: true
  field :auditable_id, ID, null: true
  field :auditable_type, String, null: true
  field :associated_id, ID, null: true
  field :associated_type, String, null: true
  field :user_id, ID, null: true
  field :user_type, String, null: true
  field :username, String, null: true
  field :action, String, null: false
  field :version, Integer, null: true
  field :comment, String, null: true
  field :remote_address, String, null: true
  field :request_uuid, String, null: false
  field :created_at, String, null: false
  field :aasm_state, String, null: false

  # Relationships
  field :user, Types::UserType, null: true

  def aasm_state
    state = object.audited_changes["aasm_state"] || object.auditable.aasm_state
    state.is_a?(Array) ? state.last : state
  end
end
