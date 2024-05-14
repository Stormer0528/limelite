module Interfaces::PayableInterface
  include Types::BaseInterface
  include Concerns::Permissable

  description "Common fields for Payables (Vendor, Customer)"

  field :id, ID, null: true
  field :name, String, null: true
  field :number, String, null: true
  field :display_name, String, null: true
  field :path, String, null: true
  field :edit_path, String, null: true
  field :visible_id, String, null: true
  field :slug, String, null: true
  field :logo_url, String, null: true
  field :aasm_state, String, null: true
  field :display_name, String, null: true

  def self.resolve_type(object, _ctx)
    if object.is_a?(Vendor)
      Types::Vendor
    elsif object.is_a?(Customer)
      Types::CustomerType
    end
  end
end
