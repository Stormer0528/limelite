class Types::EntryItemType < Types::BaseObject
  implements Interfaces::ValidatableInterface

  field :id, Integer, null: true
  field :entry_id, Integer, null: true
  field :type, String, null: true
  field :memo, String, null: true
  field :date, String, null: true
  field :account_id, ID, null: true
  field :account_name, String, null: true
  field :account_number, String, null: true
  field :account_display_name, String, null: true
  field :entry_type, String, null: true
  field :aasm_state, String, null: true

  # Amount
  field :amount_in_cents, Integer, null: true
  field :amount, String, null: true
  field :positive_amount, String, null: true

  # Relationships
  field :account, Types::AccountType, null: true
  field :entry, Types::EntryType, null: true
  field :payable, Interfaces::PayableInterface, null: true
  field :payable_name, String, null: true
  field :payable_type, String, null: true
  field :payable_id, ID, null: true

  # Account Elements
  field :account_function_id, Integer, null: true
  field :account_fund_id, Integer, null: true
  field :account_goal_id, Integer, null: true
  field :account_location_id, Integer, null: true
  field :account_object_id, Integer, null: true
  field :account_resource_id, Integer, null: true
  field :account_year_id, Integer, null: true

  field :account_function_code, String, null: true
  field :account_fund_code, String, null: true
  field :account_goal_code, String, null: true
  field :account_location_code, String, null: true
  field :account_object_code, String, null: true
  field :account_resource_code, String, null: true
  field :account_year_code, String, null: true

  field :function_code, String, null: true
  field :fund_code, String, null: true
  field :goal_code, String, null: true
  field :location_code, String, null: true
  field :object_code, String, null: true
  field :resource_code, String, null: true
  field :year_code, String, null: true

  field :credit, String, null: true
  field :debit, String, null: true
  field :url, String, null: true

  field :created_at, String, null: true
  field :updated_at, String, null: true

  # Helper Methods
  #-----------------------------------------------------------------------------
  def positive_amount
    object.positive_amount.format
  end

  def amount
    object.amount.format
  end

  def credit
    object.type  == "Credit" ? object.positive_amount.format : ""
  end

  def debit
    object.type  == "Debit" ? object.positive_amount.format : ""
  end

  def url
    "/accounts/#{object.account.slug}"
    # object&.entry&.id && "/entries/#{object.entry.id}"
  end

  def entry_type
    object.entry.entry_type
  end

  def aasm_state
    object.entry.aasm_state
  end

  def function_code
    object.account_function_code
  end

  def fund_code
    object.account_fund_code
  end

  def goal_code
    object.account_goal_code
  end

  def location_code
    object.account_location_code
  end

  def object_code
    object.account_object_code
  end

  def resource_code
    object.account_resource_code
  end

  def year_code
    object.account_year_code
  end
end
