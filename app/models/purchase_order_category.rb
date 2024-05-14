# == Schema Information
#
# Table name: purchase_order_categories
#
#  id                :bigint(8)        not null, primary key
#  name              :string
#  purchase_order_id :bigint(8)
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#
# Indexes
#
#  index_purchase_order_categories_on_purchase_order_id  (purchase_order_id)
#
# Foreign Keys
#
#  fk_rails_...  (purchase_order_id => purchase_orders.id)
#

class PurchaseOrderCategory < ApplicationRecord
  belongs_to :purchase_order
  has_many :purchase_order_items
end
