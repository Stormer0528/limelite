# NOTE: only doing this in development as some production environments (Heroku)
# NOTE: are sensitive to local FS writes, and besides -- it's just not proper
# NOTE: to have a dev-mode tool do its thing in production.
if Rails.env.development?
  task :move do
    # You can override any of these by setting an environment variable of the
    # same name.
  end


  task :num_14051 do
    check = BankAccount::Check.find(31246)
    check.update_columns(number: "14051")
  end


  task :rename_dupes do
    #BankAccount::Item.all.select(:bank_account_id, :number).group(:bank_account_id, :number).having("count(*) > 1").size

    dupes = [
      ["10163","5"],
      ["7055","9"],
      ["7834","4"],
      ["12137","33"],
      ["12569","33"],
      ["DB121619-01","5"],
      ["12136","33"],
      ["7057","9"],
      ["7666","12"],
      ["12600","33"],
      ["7056","9"],
      ["NVMS20-008", "33"]
    ]

    dupes.each do |pair|
      BankAccount::Item.where(number: pair[0], bank_account_id: pair[1]).each_with_index do |check, i|
        check.update_columns(number: "#{pair[0]}-#{i+1}")
      end
    end
  end
end
