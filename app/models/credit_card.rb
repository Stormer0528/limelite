# == Schema Information
#
# Table name: credit_cards
#
#  id                        :bigint(8)        not null, primary key
#  name                      :string
#  number                    :string(4)
#  description               :string
#  starting_balance_in_cents :integer          default(0), not null
#  starting_balance_currency :string           default("USD"), not null
#  started_at                :date
#  ended_at                  :date
#  organization_id           :bigint(8)
#  created_at                :datetime         not null
#  updated_at                :datetime         not null
#  pseudo                    :string
#  slug                      :string
#  limit_in_cents            :integer          default(0), not null
#  limit_currency            :string           default("USD"), not null
#  creator_id                :bigint(8)
#
# Indexes
#
#  index_credit_cards_on_creator_id                (creator_id)
#  index_credit_cards_on_organization_id           (organization_id)
#  index_credit_cards_on_slug                      (slug)
#  index_credit_cards_on_slug_and_organization_id  (slug,organization_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (creator_id => users.id)
#  fk_rails_...  (organization_id => organizations.id)
#

#
# Indexes
#
#  index_credit_cards_on_organization_id           (organization_id)
#  index_credit_cards_on_slug                      (slug)
#  index_credit_cards_on_slug_and_organization_id  (slug,organization_id) UNIQUE
#

class CreditCard < ApplicationRecord
  extend FriendlyId
  friendly_id :slug_candidates, use: :scoped, scope: :organization

  # RELATIONSHIPS
  #-----------------------------------------------------------------------------
  belongs_to :organization

  has_one :account
  has_many :charges,
           dependent:  :destroy,
           table_name: "credit_card_items"

  has_many :payments,
           dependent:  :destroy,
           table_name: "credit_card_items"

  has_many :items, class_name: "CreditCard::Item"
  has_many :statements, as: :statementable

  # Monetize
  monetize :starting_balance_in_cents
  monetize :limit_in_cents

  # VALIDATIONS
  #-----------------------------------------------------------------------------
  validates_presence_of :name
  validates :number, presence: true, length: {minimum: 4, maximum: 4}

  # Pundit Policy
  #---------------------------------------------------------------------------
  def self.policy_class
    StandardPolicy
  end

  # INSTANCE METHODS
  #-----------------------------------------------------------------------------
  def balance(date=nil)
    starting_balance + total_payments(date) + total_charges(date)
  end

  def monthly_charges(date=DateTime.now)
    Money.new charges.dated_between(date.beginning_of_month, date).select(:amount_in_cents).sum(:amount_in_cents)
  end

  def monthly_payments(date=DateTime.now)
    Money.new payments.dated_between(date.beginning_of_month, date).select(:amount_in_cents).sum(:amount_in_cents)
  end

  def limit_percentage
    balance / limit
  end

  def limit_remaining
    limit - balance
  end

  def last_reconciled_date
    statements.order(ended_at: :desc).limit(1).pluck(:ended_at).first
  end

  def last_statement(before_date=Date.today)
    statements.where("ended_at <= ?", before_date).order(ended_at: :desc).first ||
    statements.new(started_at: started_at.prev_month.at_beginning_of_month,
                   ended_at:   started_at.prev_month.at_end_of_month)
  end

  def last_statement_balance(before_date=Date.today)
    last_statement(before_date).persisted? ? last_statement(before_date).ending_balance : starting_balance
  end

  def total_charges(date)
    selected_charges = date.nil? ? charges : charges.dated_before(date)
    Money.new selected_charges.select(:amount_in_cents).sum(:amount_in_cents) * -1
  end

  def total_payments(date)
    selected_payments = date.nil? ? payments : payments.dated_before(date)
    Money.new selected_payments.select(:amount_in_cents).sum(:amount_in_cents)
  end

  def last_statement_balance(before_date=DateTime.now)
    statements.where("ended_at <= ?", before_date).order(ended_at: :desc).first&.ending_balance || Money.new(0)
  end

  def slug_candidates
    [
      :name,
      :pseudo,
      [:name, number]
    ]
  end
end
