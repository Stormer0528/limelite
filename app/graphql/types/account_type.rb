class Types::AccountType < Types::BaseObject
  implements Interfaces::ValidatableInterface
  include Concerns::Permissable

  field :id, Integer, null: true
  field :organization_id, ID, null: false
  field :name, String, null: true
  field :number, String, null: true
  field :restriced, Boolean, null: true
  field :start_date, String, null: true
  field :end_date, String, null: true
  field :slug, String, null: true
  field :path, String, null: false
  field :edit_path, String, null: false
  field :budgets, [Types::BudgetType], null: false
  field :current_budget, Types::BudgetType, null: true
  field :current_budget_amount, String, null: true

  field :approved_balance, Float, null: false
  field :submitted_balance, Float, null: false

  field :normal_balance, String, null: false

  # Account element codes and ids
  [:function, :function, :fund, :goal, :location, :object, :resource, :year].each do |elem|
    define_method :"account_#{elem}_code" do
      object.send(:"account_#{elem}_code")
    end

    define_method :"#{elem}_code" do
      object.send(:"account_#{elem}_code")
    end

    define_method :"account_#{elem}Code" do
      object.send(:"account_#{elem}_code")
    end

    define_method :"account_#{elem}_id" do
      object.send(:"account_#{elem}_id")
    end

    field :"#{elem}_id", Integer, null: true
    field :"#{elem}_code", String, null: true
    field :"#{elem}Code", String, null: true
  end

  def self.authorized?(object, context)
    Pundit.policy(context[:auth_ctx], object).show?
  end

  def path
    "/accounts/#{object.slug}"
  end

  def edit_path
    path + "/edit"
  end

  def number
    object.number
  end

  def approved_balance
    object.approved_balance.to_f
  end

  def submitted_balance
    object.submitted_balance.to_f
  end

  def current_budget
    object.budgets.find_by(fiscal_year: context[:fiscal_year].year)
  end

  def current_budget_amount
    current_budget&.amount&.format
  end
end
