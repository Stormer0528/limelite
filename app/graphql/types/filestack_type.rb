module Types
  class FilestackSecurityType < Types::BaseObject
    field :policy, String, null: false
    field :signature, String, null: false

    def policy
      policy_and_signature[1]
    end

    def signature
      policy_and_signature[0]
    end

    def policy_and_signature
      app_secret = ::Rails.application.config.filestack_rails.app_secret
      security = FilestackSecurity.new(app_secret,
                                       options: {"call" => %w[pick read preview slide convert upload stat store exif],
                                                 "expiry" => 3600})

      [security.signature, security.policy]
    end
  end

  class FilestackType < Types::BaseObject
    field :client_name, String, null: false
    field :apikey, String, null: false
    field :policy, String, null: false
    field :signature, String, null: false
    field :security, Types::FilestackSecurityType, null: true

    def client_name
      ::Rails.application.config.filestack_rails.client_name
    end

    def apikey
      ::Rails.application.config.filestack_rails.api_key
    end

    def policy
      policy_and_signature[1]
    end

    def signature
      policy_and_signature[0]
    end

    def policy_and_signature
      app_secret = ::Rails.application.config.filestack_rails.app_secret
      security = FilestackSecurity.new(app_secret,
                                       options: {"call" => %w[pick read convert upload stat store exif],
                                                 "expiry" => 3600})

      [security.signature, security.policy]
    end

    def security
      vars = policy_and_signature
      {policy: vars[1], signature: vars[0]}
    end
  end
end
