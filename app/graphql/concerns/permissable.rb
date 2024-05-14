module Concerns::Permissable
  extend ActiveSupport::Concern

  included do
    field :permissions, Types::PermissionsType, null: true
    def self.authorized?(object, context)
      super && Pundit.policy(context[:auth_ctx], object)&.show? || true
    rescue StandardError
      false
    end
  end

  def permissions
    policy = Pundit.policy(context[:auth_ctx], object)
    response = {}
    [
      :index,
      :create,
      :edit,
      :view,
      :show,
      :update,
      :destroy,
      :delete,
      :save_draft,
      :send_for_approval,
      :reverse_approval,
      :approve,
      :authorize,
      :deny,
      :void,
      :print
    ].each do |method_name|
      perm_name = case method_name
                  when :view
                    :show?
                  when :delete
                    :destroy?
                  else
                    :"#{method_name}?"
                  end

      response[method_name] = policy.respond_to?(perm_name) && policy.send(perm_name)
    end

    response
  end
end
