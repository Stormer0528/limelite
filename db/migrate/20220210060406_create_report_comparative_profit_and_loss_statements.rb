class CreateReportComparativeProfitAndLossStatements < ActiveRecord::Migration[5.2]
  def change
    create_table :report_comparative_profit_and_loss_statements do |t|
      t.date :start_date, default: 1.year.ago
      t.date :end_date, default: 1.day.ago
      t.jsonb :data
      t.references :organization, foreign_key: true, index: { name: 'index_comparative_profit_loss_statements_on_organization_id' }

      t.timestamps
    end
  end
end
