module Reports
  module MonthlyReportable
    extend ActiveSupport::Concern

    def months
      result = (start_date + 1.month).beginning_of_month.step(end_date).map {|date| date.beginning_of_month }.uniq
      result.unshift start_date
    end

    def month_titles
      months.map {|date| date.strftime("%b'%y") }
    end

    def db_titles
      months.map {|date| date.strftime("%b_%y") }
    end

    def titles
      ["code", "description", *month_titles, "balance"]
    end

    def colspan_width
      months.length + 3
    end

    def setup_totals_view
      month_cols = months.map do |month|
        "
        SUM(
        CASE
          WHEN entry_items.date::date < '#{month.to_formatted_s(:db)}' OR entry_items.date > '#{month.end_of_month.to_formatted_s(:db)}' THEN  0
          WHEN account_objects.normal_balance = 'Debit'  AND \"type\" = 'Debit'  THEN  amount_in_cents
          WHEN account_objects.normal_balance = 'Credit' AND \"type\" = 'Credit' THEN  amount_in_cents
          WHEN account_objects.normal_balance = 'Debit'  AND \"type\" = 'Credit' THEN -amount_in_cents
          WHEN account_objects.normal_balance = 'Credit' AND \"type\" = 'Debit'  THEN -amount_in_cents
        END) as \"#{month.strftime('%b_%y')}\"
        "
      end.join(",\n")

      query = "
      CREATE MATERIALIZED VIEW #{view_table_name(:totals_view)} AS
      SELECT 	account_objects.name AS description,
              accounts.fund_code,
              accounts.object_code,
              accounts.resource_code,

      #{month_cols},

        SUM(CASE
          WHEN account_objects.normal_balance = 'Debit'  AND \"type\" = 'Debit'  THEN  amount_in_cents
          WHEN account_objects.normal_balance = 'Credit' AND \"type\" = 'Credit' THEN  amount_in_cents
          WHEN account_objects.normal_balance = 'Debit'  AND \"type\" = 'Credit' THEN -amount_in_cents
          WHEN account_objects.normal_balance = 'Credit' AND \"type\" = 'Debit'  THEN -amount_in_cents
        END) as \"total_in_cents\"

      FROM #{view_table_name(:entry_items_view)} AS entry_items
        INNER JOIN #{view_table_name(:accounts_view)} AS accounts ON accounts.id = entry_items.account_id
        INNER JOIN account_objects ON account_objects.id = accounts.account_object_id
      GROUP BY resource_code, accounts.object_code, accounts.fund_code, account_objects.name;

      CREATE INDEX #{view_table_name(:totals_view_resource_code)} ON #{view_table_name(:totals_view)} (resource_code);
      CREATE INDEX #{view_table_name(:totals_view_fund_code)} ON #{view_table_name(:totals_view)} (fund_code);
      "

      ActiveRecord::Base.connection.execute query
    end
  end
end
