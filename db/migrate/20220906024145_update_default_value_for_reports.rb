class UpdateDefaultValueForReports < ActiveRecord::Migration[5.2]
  def change
    change_table :report_comparative_profit_and_loss_statements do |t|
      t.change "data", :jsonb, default: {}
    end

    change_table :report_comparative_balance_sheets do |t|
      t.change "data", :jsonb, default: {}
    end
  end
end
