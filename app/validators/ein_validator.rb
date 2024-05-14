class EinValidator < ActiveModel::Validator
  def validate(record)
    if record.ten_ninety_nine?
      if record.ein.blank?
        record.errors[:ein] << '1099 Vendors require an EIN'
      end

      if record.ein =~ /[A-z]/
        record.errors[:ein] << "Cannot contain letters"
      end

      numeric_value = record.ein.gsub(/[^0-9]/, "")

      # validate length == 9 digits
      unless numeric_value.length == 9
        record.errors[:ein] << "incorrect EIN length"
      end

      # validate prefix
      # unless [
      # "01", "02", "03", "04", "05", "06", "10", "11", "12", "13", "14", "15",
      # "16", "20", "21", "22", "23", "24", "25", "26", "27", "30", "31", "32",
      # "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44",
      # "45", "46", "47", "48", "50", "51", "52", "53", "54", "55", "56", "57",
      # "58", "59", "60", "61", "62", "63", "64", "65", "66", "67", "68", "71",
      # "72", "73", "74", "75", "76", "77", "80", "81", "82", "83", "84", "85",
      # "86", "87", "88", "90", "91", "92", "93", "94", "95", "98", "99"
      # ].include?(numeric_value[0..1])
      # record.errors[attribute] << (options[:message] || "invalid EIN prefix")
      # end
    end
  end
end
