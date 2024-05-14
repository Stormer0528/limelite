module AccountElement
  extend ActiveSupport::Concern

  included do
    extend FriendlyId
    friendly_id :slug_candidates, use: :scoped, scope: :organization

    # Associations
    #---------------------------------------------------------------------------
    belongs_to :organization
    has_many :accounts, dependent: :destroy

    # Scopes
    #---------------------------------------------------------------------------
    def self.default
      where code: ["0000", "000", "00", "0"]
    end

    # Validations
    #---------------------------------------------------------------------------
    validates :code,  presence:   true,
                      uniqueness: {scope: :organization_id, allow_blank: false}
    validates :name,  presence: true

    # Pundit Policy
    #---------------------------------------------------------------------------
    def self.policy_class
      AccountPolicy
    end
  end

  def slug_candidates
    [
      :code,
      [:code, :name]
    ]
  end
end
