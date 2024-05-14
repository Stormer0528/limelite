
module Reports
  module ComparativeReportable
    extend ActiveSupport::Concern

    def setup_entry_items_view
      current_year_query = Entry::EntryItemSearch.new(
        scope: EntryItem.joins(:entry, :account, account: %i[account_fund account_resource account_object]),
        filters: {
          organization_id: organization_id,
          start_date: start_date,
          end_date: end_date,
          approved: true,
          account: data&.with_indifferent_access[:account_search_params]
        }
        ).results.select('"entry_items".amount_in_cents, "entry_items".account_id, "entry_items".type, "entries".date as date, account_objects.code as object_code, account_funds.code as fund_code, 0 as year_before').to_sql

      before_year_query = Entry::EntryItemSearch.new(
        scope: EntryItem.joins(:entry, :account, account: %i[account_fund account_resource account_object]),
        filters: {
          organization_id: organization_id,
          start_date: 1.year.before(start_date),
          end_date: 1.year.before(end_date),
          approved: true,
          account: data&.with_indifferent_access[:account_search_params]
        }
        ).results.select('"entry_items".amount_in_cents, "entry_items".account_id, "entry_items".type, "entries".date as date, account_objects.code as object_code, account_funds.code as fund_code, 1 as year_before').to_sql

      query = "CREATE MATERIALIZED VIEW #{view_table_name(:entry_items_view)} AS " + current_year_query + " UNION ALL " + before_year_query + ";"

      ActiveRecord::Base.connection.execute query
    end

    def setup_totals_view
      query = "
      CREATE MATERIALIZED VIEW #{view_table_name(:totals_view)} AS
      SELECT 	account_objects.name AS description,
              accounts.fund_code,
              accounts.object_code,
              accounts.resource_code,
              entry_items.year_before,
        SUM(CASE
          WHEN account_objects.normal_balance = 'Debit'  AND \"type\" = 'Debit'  THEN  amount_in_cents
          WHEN account_objects.normal_balance = 'Credit' AND \"type\" = 'Credit' THEN  amount_in_cents
          WHEN account_objects.normal_balance = 'Debit'  AND \"type\" = 'Credit' THEN -amount_in_cents
          WHEN account_objects.normal_balance = 'Credit' AND \"type\" = 'Debit'  THEN -amount_in_cents
        END) as \"total_in_cents\"
      FROM #{view_table_name(:entry_items_view)} AS entry_items
        INNER JOIN #{view_table_name(:accounts_view)} AS accounts ON accounts.id = entry_items.account_id
        INNER JOIN account_objects ON account_objects.id = accounts.account_object_id
      GROUP BY year_before, resource_code, accounts.object_code, accounts.fund_code, account_objects.name;

      CREATE INDEX #{view_table_name(:totals_view_resource_code)} ON #{view_table_name(:totals_view)} (resource_code);
      CREATE INDEX #{view_table_name(:totals_view_fund_code)} ON #{view_table_name(:totals_view)} (fund_code);
      "

      ActiveRecord::Base.connection.execute query
    end
  end
end
