# == Schema Information
#
# Table name: audits
#
#  id               :bigint(8)        not null, primary key
#  auditable_id     :integer
#  auditable_type   :string
#  associated_id    :integer
#  associated_type  :string
#  user_id          :integer
#  user_type        :string
#  username         :string
#  action           :string
#  audited_changes  :jsonb
#  version          :integer          default(0)
#  comment          :string
#  remote_address   :string
#  request_uuid     :string
#  created_at       :datetime
#  associated_items :jsonb            not null
#
# Indexes
#
#  associated_index              (associated_type,associated_id)
#  auditable_index               (auditable_type,auditable_id,version)
#  index_audits_on_created_at    (created_at)
#  index_audits_on_request_uuid  (request_uuid)
#  user_index                    (user_id,user_type)
#
class StatementAudit < Audited::Audit
  after_create :save_associated_items

  def save_associated_items
    return unless auditable.instance_of?(Statement)

    associated_items[:reconciliations] = auditable.reconciliations
    associated_items[:"#{statementable_typename}_items"] =
      format_items auditable.send("#{statementable_typename}_items")
    associated_items[:unreconciled_items] = format_items auditable.organization.send("#{auditable.statementable_type.underscore}_items").unreconciled.where(
      "#{auditable.statementable_type.underscore}_id = ? AND date <= ?",
      auditable.statementable_id, auditable.ended_at
    )

    # A normalized version for statements view
    associated_items[:items] = {"credits" => [], "debits" => []}
    auditable.reconciliations.each do |rec|
      next if rec.reconcilable_item.nil?

      item = rec.reconcilable_item.attributes.dup
      item["balance_type"] = balance_type(rec.reconcilable_item)
      item["item_type"] = rec.reconcilable_item.name
      item["type_name"] = rec.reconcilable_item.type.demodulize.titleize
      item["payee"] = rec.reconcilable_item.payee
      item["amount"] = rec.reconcilable_item.amount.format
      item["amount_in_cents"] = rec.reconcilable_item.amount_in_cents

      associated_items[:items][balance_type(rec.reconcilable_item) + "s"] << item
    end

    save
  end

  def revision
    return super unless auditable.instance_of?(Statement)

    associated_items.with_indifferent_access.tap do |ao|
      auditable.reconciliations    = ao[:reconciliations]
      auditable.bank_account_items = ao[:bank_account_items]
      auditable.credit_card_items = ao[:credit_card_items]
    end
  end

  def statementable_typename
    auditable.statementable.class.name.underscore
  end

  # By default json store remove type information, which we need
  def format_items(items)
    items.map do |item|
      item.attributes.merge(
        payee: item.payee,
        balance_type: balance_type(item),
        from_bank_account_item: respond_to?(:from_bank_account_item) && item.from_bank_account_item?,
        to_bank_account_item: respond_to?(:from_bank_account_item) && item.to_bank_account_item?
      )
    end
  end

  def balance_type(item)
    case item["type"]
    when "BankAccount::Check"
      "debit"
    when "CreditCard::Charge"
      "debit"
    when "BankAccount::Deposit"
      "credit"
    when "CreditCard::Payment"
      "credit"
    when "BankAccount::AccountTransfer"
      item.from_bank_account_item? ? "debit" : "credit"
    end
  end
end
