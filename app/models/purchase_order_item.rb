# == Schema Information
#
# Table name: purchase_order_items
#
#  id                :bigint(8)        not null, primary key
#  purchase_order_id :bigint(8)
#  quantity          :integer          default(0)
#  description       :string
#  price_in_cents    :integer          default(0), not null
#  price_currency    :string           default("USD"), not null
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  order             :integer          default(0)
#
# Indexes
#
#  index_purchase_order_items_on_purchase_order_id  (purchase_order_id)
#
# Foreign Keys
#
#  fk_rails_...  (purchase_order_id => purchase_orders.id)
#

class PurchaseOrderItem < ApplicationRecord
  belongs_to :purchase_order

  monetize :price_in_cents

  def total
    price * quantity
  end

  def total_in_cents
    price_in_cents * quantity
  end
end
