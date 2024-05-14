# == Schema Information
#
# Table name: phones
#
#  id             :integer          not null, primary key
#  number         :string
#  type           :string
#  phoneable_id   :integer
#  phoneable_type :string
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#
# Indexes
#
#  index_phones_on_phoneable_type_and_phoneable_id  (phoneable_type,phoneable_id)
#

class Phone < ActiveRecord::Base
  belongs_to :phoneable, polymorphic: true, optional: true

  phony_normalize :number, default_country_code: "US"
  validates_plausible_phone :number

  TYPES = %w(Home Work Fax Mobile).freeze
end
