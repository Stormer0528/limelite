module Payable
  extend ActiveSupport::Concern

  included do
    has_many :payments, as: :payable
  end
end
