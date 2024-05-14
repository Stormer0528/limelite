class ReconciledValidator < ActiveModel::Validator
  def validate(record)
    if record.reconciled? && record.amount != record.entry_items_amount
      record.errors[:reconciled] << "Cannot update amount after being reconciled"
    end
  end
end
