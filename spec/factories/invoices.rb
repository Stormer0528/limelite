# == Schema Information
#
# Table name: invoices
#
#  id                :integer          not null, primary key
#  number            :string
#  date              :date
#  description       :text
#  due_date          :date
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  slug              :string
#  invoiceable_type  :string
#  invoiceable_id    :bigint(8)
#  file_url          :string
#  aasm_state        :string
#  organization_id   :bigint(8)
#  paid              :boolean          default(FALSE)
#  final_payment_url :string
#  creator_id        :bigint(8)
#
# Indexes
#
#  index_invoices_on_aasm_state                           (aasm_state)
#  index_invoices_on_creator_id                           (creator_id)
#  index_invoices_on_date                                 (date)
#  index_invoices_on_due_date                             (due_date)
#  index_invoices_on_invoiceable_type_and_invoiceable_id  (invoiceable_type,invoiceable_id)
#  index_invoices_on_number                               (number)
#  index_invoices_on_number_and_invoiceable               (number,invoiceable_type,invoiceable_id) UNIQUE WHERE ((aasm_state)::text <> 'voided'::text)
#  index_invoices_on_organization_id                      (organization_id)
#  index_invoices_on_slug                                 (slug)
#  index_invoices_on_slug_invoiceable                     (slug,invoiceable_type,invoiceable_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (creator_id => users.id)
#  fk_rails_...  (organization_id => organizations.id)
#

FactoryBot.define do
  factory :invoice do
    # vendor nil
    # number "MyString"
    # date "2017-06-19"
    # description "MyText"
    # due_date "2017-06-19"
    # amount_in_cents 1
  end
end
