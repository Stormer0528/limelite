# == Schema Information
#
# Table name: entry_items
#
#  id              :bigint(8)        not null, primary key
#  entry_id        :bigint(8)
#  amount_in_cents :integer          default(0), not null
#  amount_currency :string           default("USD"), not null
#  type            :string
#  account_id      :bigint(8)
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  memo            :string
#  payable_type    :string
#  payable_id      :bigint(8)
#
# Indexes
#
#  index_entry_items_on_account_id                   (account_id)
#  index_entry_items_on_entry_id                     (entry_id)
#  index_entry_items_on_payable_type_and_payable_id  (payable_type,payable_id)
#  index_entry_items_on_type                         (type)
#
# Foreign Keys
#
#  fk_rails_...  (account_id => accounts.id)
#  fk_rails_...  (entry_id => entries.id)
#

class Debit < EntryItem
  def amount
    # NOTE: type can change during update and not update the Credit/Debit class
    type == "Debit" ? - super : super
  end
end
