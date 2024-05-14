class CheckPolicy < BankItemPolicy
  def reverse_approval?
    super && @record.aasm_state.to_sym == :approved
  end

  def print?
    approve? && @record.aasm_state.to_sym == :approved
  end

  def void?
    approve? && [:approved, :printed].include?(@record.aasm_state.to_sym)
  end
end
