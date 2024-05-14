class Entry::Import
  include ActiveModel::Model
  attr_accessor :memo, :errors

  def add_error(message)
    @errors.push message
  end

  def initialize
    super

    @memo = ""
    @errors = []
  end


  # Pundit Policy
  #---------------------------------------------------------------------------
  def self.policy_class
    EntryPolicy
  end
end
