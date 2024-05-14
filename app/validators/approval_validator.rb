class ApprovalValidator < ActiveModel::Validator
  def validate(record)
    record_approved = ["approved", "printed"].include? record.attribute_in_database(:aasm_state)
    recored_approval_removed = record.aasm_state_changed? && !["approved", "printed"].include?(record.aasm_state)
    only_state_changed = record.changed.select {|c| c == "aasm_state" }.count > 0

    record.errors[:aasm_state] << "Cannot update after approval" if record_approved && !(recored_approval_removed || only_state_changed)
  end
end
