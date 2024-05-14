# == Schema Information
#
# Table name: printer_settings
#
#  id                    :bigint(8)        not null, primary key
#  name                  :string
#  slug                  :string
#  printer_type          :string
#  payee_offset_x        :integer          default(0)
#  payee_offset_y        :integer          default(0)
#  date_offset_x         :integer          default(0)
#  date_offset_y         :integer          default(0)
#  amount_offset_x       :integer          default(0)
#  amount_offset_y       :integer          default(0)
#  memo_offset_x         :integer          default(0)
#  memo_offset_y         :integer          default(0)
#  signature_offset_x    :integer          default(0)
#  signature_offset_y    :integer          default(0)
#  amount_text_offset_x  :integer          default(0)
#  amount_text_offset_y  :integer          default(0)
#  check_margin          :integer          default(0)
#  organization_id       :bigint(8)
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#  micr_offset_x         :integer          default(0)
#  micr_offset_y         :integer          default(0)
#  voucher1_offset_y     :integer          default(0)
#  voucher2_offset_y     :integer          default(0)
#  invoice_no_x          :integer          default(0)
#  invoice_no_y          :integer          default(0)
#  invoice_date_x        :integer          default(0)
#  invoice_date_y        :integer          default(0)
#  invoice_amount_x      :integer          default(0)
#  invoice_amount_y      :integer          default(0)
#  invoice_amount_paid_x :integer          default(0)
#  invoice_amount_paid_y :integer          default(0)
#  invoice_description_x :integer          default(0)
#  invoice_description_y :integer          default(0)
#  direction             :string           default("ASC")
#
# Indexes
#
#  index_printer_settings_on_name_and_organization_id  (name,organization_id) UNIQUE
#  index_printer_settings_on_organization_id           (organization_id)
#  index_printer_settings_on_slug                      (slug)
#  index_printer_settings_on_slug_and_organization_id  (slug,organization_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (organization_id => organizations.id)
#

class PrinterSetting < ApplicationRecord
  TYPES = ["Standard", "Voucher", "Alt Voucher", "CYMA"].freeze
  DIRECTIONS = ["ASC", "DESC"].freeze

  # Relationships
  #-----------------------------------------------------------------------------
  belongs_to :organization

  # Validations
  #-----------------------------------------------------------------------------
  validates :name, presence: true
  validates :printer_type, presence: true

    # Pundit Policy
  #---------------------------------------------------------------------------
  def self.policy_class
    StandardPolicy
  end
end
