module Concerns::Authorizations
  extend ActiveSupport::Concern

  included do
    field :authorizations, [Types::AuthorizationType], null: true
    field :authorization_path, [Types::UserGroupType], null: true
    field :authorization_path_index, Integer, null: true

    def authorization_path_index
      return object.authorization_path&.length if object.authorized?
      return nil if object.aasm_state != "needs_approval"

      object.authorization_path&.find_index {|group| group&.id == object.current_auth_group&.id } || 0
    end
  end
end
