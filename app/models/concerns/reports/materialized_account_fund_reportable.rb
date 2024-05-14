##
# Functions for setting up reports with materialized views
# -- allows setting up summary views of account_funds which can be queried,
#    rather than looping through the ActiveRecord collection
# -- has improved method for determining totals
# -- has logic for creating unique table names

module Reports
  module MaterializedAccountFundReportable
    extend ActiveSupport::Concern

    def drop_views
      ActiveRecord::Base.connection.execute "
        DROP MATERIALIZED VIEW IF EXISTS #{view_table_name(:totals_view)} CASCADE;
        DROP MATERIALIZED VIEW IF EXISTS #{view_table_name(:entry_items_view)} CASCADE;
        DROP VIEW IF EXISTS #{view_table_name(:accounts_view)} CASCADE;
      "
    end

    def setup_accounts_view
      # NOTE: Need this to limit entry items to selected accounts
      table_query = Account::AccountSearch.new(
        scope: organization.accounts.joins(:account_fund, :account_resource, :account_object),
        filters: data&.with_indifferent_access[:account_search_params]&.transform_values {|v| parse_element_w_range(v) }
      ).results.select("accounts.*, account_objects.code as object_code, account_objects.object_type as account_object_type, account_funds.code as fund_code, account_resources.code as resource_code").to_sql
      query = "CREATE OR REPLACE VIEW #{view_table_name(:accounts_view)} AS " + table_query
      ActiveRecord::Base.connection.execute query
    end

    def setup_entry_items_view
      table_query = Entry::EntryItemSearch.new(
        scope: EntryItem.joins(:entry, :account, account: %i[account_fund account_resource account_object]),
        filters: {
          organization_id: organization_id,
          start_date: start_date,
          end_date: end_date,
          approved: true,
          account: data&.with_indifferent_access[:account_search_params]
        }
      ).results.select('"entry_items".amount_in_cents, "entry_items".account_id, "entry_items".type, "entries".date as date, account_objects.code as object_code, account_funds.code as fund_code').to_sql
      query = "CREATE MATERIALIZED VIEW #{view_table_name(:entry_items_view)} AS " + table_query + "
      ;
      "

      ActiveRecord::Base.connection.execute query
    end

    def setup_totals_view
      query = "
      CREATE MATERIALIZED VIEW #{view_table_name(:totals_view)} AS
      SELECT 	account_objects.name AS description,
              accounts.fund_code,
              accounts.object_code,
              accounts.resource_code,
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

    def setup_local_classes
      # Totals
      @totals = Class.new(ApplicationRecord) do
        self.table_name = "account_objects"
      end

      @totals.table_name = view_table_name(:totals_view)
    end

    def view_table_name(infix="view")
      # view_key is assigned in setup. must be the same for all calls so tables can be added/dropped

      # Generate random key for table views
      # -- key must be lowercase
      # -- key must be first, in case table name is too long
      # -- psql tablenames cannot start with a number
      @view_key ||= SecureRandom.alphanumeric(9).downcase
      prefix = ["r", @view_key, organization.id].join("_")
      postfix = self.class.name.demodulize.underscore

      [prefix, infix, postfix].join("_")
    end
  end
end
