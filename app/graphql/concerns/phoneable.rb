module Concerns::Phoneable
  extend ActiveSupport::Concern
  include ActionView::Helpers::NumberHelper

  included do
    field :home_phone_number, String, null: true
    field :mobile_phone_number, String, null: true
    field :work_phone_number, String, null: true
    field :fax_phone_number, String, null: true

    def home_phone_number
      return nil if object.home_phone_number&.empty?

      number_to_phone object.home_phone_number, area_code: true
    end

    def mobile_phone_number
      return nil if object.mobile_phone_number&.empty?

      number_to_phone object.mobile_phone_number, area_code: true
    end

    def work_phone_number
      return nil if object.work_phone_number&.empty?

      number_to_phone object.work_phone_number, area_code: true
    end

    def fax_phone_number
      return nil if object.fax_phone_number&.empty?

      number_to_phone object.fax_phone_number, area_code: true
    end
  end
end
