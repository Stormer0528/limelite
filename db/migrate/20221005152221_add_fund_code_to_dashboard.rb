class AddFundCodeToDashboard < ActiveRecord::Migration[5.2]
  def change
    add_column :report_dashboards, :fund_code, :string
  end
end
