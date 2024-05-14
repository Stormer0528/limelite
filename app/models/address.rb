# == Schema Information
#
# Table name: addresses
#
#  id               :integer          not null, primary key
#  line1            :string
#  line2            :string
#  city             :string
#  state            :string
#  zip              :string
#  addressable_type :string
#  addressable_id   :integer
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  name             :string
#  attention        :string
#  department       :string
#
# Indexes
#
#  index_addresses_on_addressable_id_and_addressable_type  (addressable_id,addressable_type)
#

class Address < ApplicationRecord
  belongs_to :addressable, polymorphic: true, optional: true

  has_many :payments
  has_many :checks

  def empty?
    [line1, line2, city, state, zip].all? {|field| field.nil? || field.empty? }
  end

  def to_text(separator: "\n")
    return "" if empty?

    [line1, line2, "#{city}, #{state} #{zip}"].reject(&:empty?).join(separator)
  end

  validates_presence_of :name, :line1, :city, :state, :zip
end
