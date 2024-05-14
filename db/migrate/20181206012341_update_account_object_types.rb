class UpdateAccountObjectTypes < ActiveRecord::Migration[5.1]
  def up
    AccountObject.where("code LIKE '97%%'").update(object_type: "Equity")
  end

  def down
  end
end
