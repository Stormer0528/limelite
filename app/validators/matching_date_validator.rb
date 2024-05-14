class MatchingDateValidator < ActiveModel::Validator
  def validate(record)
    if record.bank_account_items.present? && [record.date] & record.bank_account_items.map(&:date) != [record.date]
      record.errors[:date] << "Date does not match the associated bank account item(s)."
    end

    if record.journalable && record.journalable.date != record.date
      record.errors[:date] << "Date does not match the associated #{record.journalable.class.name}."
    end
  end
end

