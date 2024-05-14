Types::PermissionsType = GraphQL::ObjectType.define do
  name "Permissions"

  field :index, types.Boolean, hash_key: :index
  field :create, types.Boolean, hash_key: :create
  field :edit, types.Boolean, hash_key: :edit
  field :view, types.Boolean, hash_key: :view
  field :show, types.Boolean, hash_key: :show
  field :update, types.Boolean, hash_key: :update
  field :delete, types.Boolean, hash_key: :delete
  field :save_draft, types.Boolean, hash_key: :save_draft
  field :send_for_approval, types.Boolean, hash_key: :send_for_approval
  field :reverse_approval, types.Boolean, hash_key: :send_for_approval
  field :approve, types.Boolean, hash_key: :approve
  field :deny, types.Boolean, hash_key: :deny
  field :print, types.Boolean, hash_key: :print
  field :void, types.Boolean, hash_key: :void
  field :authorize, types.Boolean, hash_key: :authorize
end
