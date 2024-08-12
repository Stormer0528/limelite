# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2024_08_11_144953) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "account_functions", id: :serial, force: :cascade do |t|
    t.string "name"
    t.string "code"
    t.integer "organization_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "slug"
    t.index ["code", "organization_id"], name: "index_account_functions_on_code_and_organization_id", unique: true
    t.index ["code"], name: "index_account_functions_on_code"
    t.index ["organization_id"], name: "index_account_functions_on_organization_id"
  end

  create_table "account_funds", id: :serial, force: :cascade do |t|
    t.string "name"
    t.string "code"
    t.integer "organization_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "slug"
    t.index ["code", "organization_id"], name: "index_account_funds_on_code_and_organization_id", unique: true
    t.index ["code"], name: "index_account_funds_on_code"
    t.index ["organization_id"], name: "index_account_funds_on_organization_id"
  end

  create_table "account_goals", id: :serial, force: :cascade do |t|
    t.string "name"
    t.string "code"
    t.integer "organization_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "slug"
    t.index ["code", "organization_id"], name: "index_account_goals_on_code_and_organization_id", unique: true
    t.index ["code"], name: "index_account_goals_on_code"
    t.index ["organization_id"], name: "index_account_goals_on_organization_id"
  end

  create_table "account_locations", id: :serial, force: :cascade do |t|
    t.string "name"
    t.string "code"
    t.integer "organization_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "slug"
    t.index ["code", "organization_id"], name: "index_account_locations_on_code_and_organization_id", unique: true
    t.index ["code"], name: "index_account_locations_on_code"
    t.index ["organization_id"], name: "index_account_locations_on_organization_id"
  end

  create_table "account_objects", id: :serial, force: :cascade do |t|
    t.string "name"
    t.string "code"
    t.integer "organization_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "normal_balance"
    t.string "object_type"
    t.string "slug"
    t.string "rollup"
    t.index ["code", "organization_id"], name: "index_account_objects_on_code_and_organization_id", unique: true
    t.index ["code"], name: "index_account_objects_on_code"
    t.index ["normal_balance"], name: "index_account_objects_on_normal_balance"
    t.index ["object_type"], name: "index_account_objects_on_object_type"
    t.index ["organization_id"], name: "index_account_objects_on_organization_id"
  end

  create_table "account_resources", id: :serial, force: :cascade do |t|
    t.string "name"
    t.string "code"
    t.integer "organization_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "slug"
    t.boolean "restricted"
    t.index ["code", "organization_id"], name: "index_account_resources_on_code_and_organization_id", unique: true
    t.index ["code"], name: "index_account_resources_on_code"
    t.index ["organization_id"], name: "index_account_resources_on_organization_id"
  end

  create_table "account_years", id: :serial, force: :cascade do |t|
    t.string "name"
    t.string "code"
    t.integer "organization_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "slug"
    t.index ["code", "organization_id"], name: "index_account_years_on_code_and_organization_id", unique: true
    t.index ["code"], name: "index_account_years_on_code"
    t.index ["organization_id"], name: "index_account_years_on_organization_id"
  end

  create_table "accounts", id: :serial, force: :cascade do |t|
    t.integer "organization_id"
    t.boolean "restriced"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "account_function_id"
    t.integer "account_fund_id"
    t.integer "account_goal_id"
    t.integer "account_location_id"
    t.integer "account_object_id"
    t.integer "account_resource_id"
    t.integer "account_year_id"
    t.string "slug"
    t.integer "budget_in_cents", default: 0, null: false
    t.string "budget_currency", default: "USD", null: false
    t.index ["account_function_id"], name: "index_accounts_on_account_function_id"
    t.index ["account_fund_id"], name: "index_accounts_on_account_fund_id"
    t.index ["account_goal_id"], name: "index_accounts_on_account_goal_id"
    t.index ["account_location_id"], name: "index_accounts_on_account_location_id"
    t.index ["account_object_id"], name: "index_accounts_on_account_object_id"
    t.index ["account_resource_id"], name: "index_accounts_on_account_resource_id"
    t.index ["account_year_id"], name: "index_accounts_on_account_year_id"
    t.index ["organization_id", "account_function_id", "account_fund_id", "account_goal_id", "account_location_id", "account_object_id", "account_resource_id", "account_year_id"], name: "index_accounts_on_multiple_references", unique: true
    t.index ["organization_id"], name: "index_accounts_on_organization_id"
    t.index ["slug", "organization_id"], name: "index_accounts_on_slug_and_organization_id", unique: true
    t.index ["slug"], name: "index_accounts_on_slug"
  end

  create_table "addresses", id: :serial, force: :cascade do |t|
    t.string "line1"
    t.string "line2"
    t.string "city"
    t.string "state"
    t.string "zip"
    t.string "addressable_type"
    t.integer "addressable_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "name"
    t.string "attention"
    t.string "department"
    t.index ["addressable_id", "addressable_type"], name: "index_addresses_on_addressable_id_and_addressable_type"
  end

  create_table "ap_file_download_logs", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "file_upload_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["file_upload_id"], name: "index_ap_file_download_logs_on_file_upload_id"
    t.index ["user_id"], name: "index_ap_file_download_logs_on_user_id"
  end

  create_table "audits", force: :cascade do |t|
    t.integer "auditable_id"
    t.string "auditable_type"
    t.integer "associated_id"
    t.string "associated_type"
    t.integer "user_id"
    t.string "user_type"
    t.string "username"
    t.string "action"
    t.jsonb "audited_changes"
    t.integer "version", default: 0
    t.string "comment"
    t.string "remote_address"
    t.string "request_uuid"
    t.datetime "created_at"
    t.jsonb "associated_items", default: {}, null: false
    t.index ["associated_type", "associated_id"], name: "associated_index"
    t.index ["auditable_type", "auditable_id", "version"], name: "auditable_index"
    t.index ["created_at"], name: "index_audits_on_created_at"
    t.index ["request_uuid"], name: "index_audits_on_request_uuid"
    t.index ["user_id", "user_type"], name: "user_index"
  end

  create_table "authorizations", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "user_group_id"
    t.string "authorizable_type"
    t.bigint "authorizable_id"
    t.string "action"
    t.string "reason"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["authorizable_type", "authorizable_id"], name: "index_authorizations_on_authorizable_type_and_authorizable_id"
    t.index ["user_group_id"], name: "index_authorizations_on_user_group_id"
    t.index ["user_id"], name: "index_authorizations_on_user_id"
  end

  create_table "bank_account_items", force: :cascade do |t|
    t.integer "amount_in_cents", default: 0, null: false
    t.string "amount_currency", default: "USD", null: false
    t.date "date"
    t.string "memo"
    t.string "number"
    t.string "type"
    t.bigint "bank_account_id"
    t.integer "creator_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "paper_check", default: false
    t.string "file_url"
    t.string "aasm_state"
    t.bigint "address_id"
    t.bigint "entry_id"
    t.string "check_type"
    t.index ["aasm_state"], name: "index_bank_account_items_on_aasm_state"
    t.index ["address_id"], name: "index_bank_account_items_on_address_id"
    t.index ["bank_account_id"], name: "index_bank_account_items_on_bank_account_id"
    t.index ["creator_id"], name: "index_bank_account_items_on_creator_id"
    t.index ["date"], name: "index_bank_account_items_on_date"
    t.index ["entry_id"], name: "index_bank_account_items_on_entry_id"
    t.index ["number", "bank_account_id"], name: "index_bank_account_items_on_number_and_bank_account_id", unique: true, where: "((number)::text <> ''::text)"
    t.index ["type"], name: "index_bank_account_items_on_type"
  end

  create_table "bank_accounts", force: :cascade do |t|
    t.string "pseudo"
    t.string "number"
    t.string "name"
    t.text "description"
    t.date "started_at"
    t.date "ended_at"
    t.string "edp_number"
    t.string "state_account_number"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "organization_id"
    t.integer "starting_balance_in_cents", default: 0, null: false
    t.string "starting_balance_currency", default: "USD", null: false
    t.bigint "account_object_id"
    t.string "slug"
    t.string "routing_number"
    t.string "bank_name"
    t.string "fractional_number"
    t.bigint "creator_id"
    t.index ["account_object_id"], name: "index_bank_accounts_on_account_object_id"
    t.index ["creator_id"], name: "index_bank_accounts_on_creator_id"
    t.index ["organization_id"], name: "index_bank_accounts_on_organization_id"
    t.index ["slug", "organization_id"], name: "index_bank_accounts_on_slug_and_organization_id", unique: true
    t.index ["slug"], name: "index_bank_accounts_on_slug"
  end

  create_table "batch_uploads", force: :cascade do |t|
    t.integer "total_invoices"
    t.integer "critical_invoices"
    t.text "notes"
    t.integer "creator_id"
    t.string "aasm_state"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "organization_id"
    t.json "data", default: {"files"=>[]}
    t.index ["aasm_state"], name: "index_batch_uploads_on_aasm_state"
    t.index ["creator_id"], name: "index_batch_uploads_on_creator_id"
    t.index ["organization_id"], name: "index_batch_uploads_on_organization_id"
  end

  create_table "budgets", force: :cascade do |t|
    t.integer "fiscal_year"
    t.bigint "account_id"
    t.integer "amount_in_cents", default: 0, null: false
    t.string "amount_currency", default: "USD", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["account_id"], name: "index_budgets_on_account_id"
  end

  create_table "credit_card_items", force: :cascade do |t|
    t.date "date"
    t.string "memo"
    t.string "file_url"
    t.string "type"
    t.bigint "entry_id"
    t.integer "amount_in_cents", default: 0, null: false
    t.string "amount_currency", default: "USD", null: false
    t.bigint "credit_card_id"
    t.string "aasm_state", default: "draft"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "creator_id"
    t.string "number"
    t.index ["aasm_state"], name: "index_credit_card_items_on_aasm_state"
    t.index ["creator_id"], name: "index_credit_card_items_on_creator_id"
    t.index ["credit_card_id"], name: "index_credit_card_items_on_credit_card_id"
    t.index ["date"], name: "index_credit_card_items_on_date"
    t.index ["entry_id"], name: "index_credit_card_items_on_entry_id"
    t.index ["type"], name: "index_credit_card_items_on_type"
  end

  create_table "credit_cards", force: :cascade do |t|
    t.string "name"
    t.string "number", limit: 4
    t.string "description"
    t.integer "starting_balance_in_cents", default: 0, null: false
    t.string "starting_balance_currency", default: "USD", null: false
    t.date "started_at"
    t.date "ended_at"
    t.bigint "organization_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "pseudo"
    t.string "slug"
    t.integer "limit_in_cents", default: 0, null: false
    t.string "limit_currency", default: "USD", null: false
    t.bigint "creator_id"
    t.index ["creator_id"], name: "index_credit_cards_on_creator_id"
    t.index ["organization_id"], name: "index_credit_cards_on_organization_id"
    t.index ["slug", "organization_id"], name: "index_credit_cards_on_slug_and_organization_id", unique: true
    t.index ["slug"], name: "index_credit_cards_on_slug"
  end

  create_table "customers", force: :cascade do |t|
    t.string "title"
    t.string "first_name"
    t.string "last_name"
    t.string "middle_name"
    t.string "suffix"
    t.string "company"
    t.string "email"
    t.string "website"
    t.text "notes"
    t.bigint "organization_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "slug"
    t.string "logo_url"
    t.string "aasm_state"
    t.string "number"
    t.bigint "creator_id"
    t.index ["aasm_state"], name: "index_customers_on_aasm_state"
    t.index ["creator_id"], name: "index_customers_on_creator_id"
    t.index ["organization_id"], name: "index_customers_on_organization_id"
    t.index ["slug", "organization_id"], name: "index_customers_on_slug_and_organization_id", unique: true
    t.index ["slug"], name: "index_customers_on_slug"
  end

  create_table "denial_notifications", force: :cascade do |t|
    t.bigint "organization_id"
    t.bigint "user_id"
    t.string "authorizable_type"
    t.bigint "authorizable_id"
    t.string "reason"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["authorizable_type", "authorizable_id"], name: "authable_deny_items"
    t.index ["organization_id"], name: "index_denial_notifications_on_organization_id"
    t.index ["user_id"], name: "index_denial_notifications_on_user_id"
  end

  create_table "entries", id: :serial, force: :cascade do |t|
    t.integer "organization_id"
    t.integer "creator_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.date "date"
    t.string "entry_type", default: "Transaction"
    t.string "journalable_type"
    t.bigint "journalable_id"
    t.string "aasm_state"
    t.string "backup_file_url"
    t.string "file_url"
    t.index ["aasm_state"], name: "index_entries_on_aasm_state"
    t.index ["creator_id"], name: "index_entries_on_creator_id"
    t.index ["date"], name: "index_entries_on_date"
    t.index ["entry_type"], name: "index_entries_on_entry_type"
    t.index ["journalable_type", "journalable_id"], name: "index_entries_on_journalable_type_and_journalable_id"
    t.index ["organization_id"], name: "index_entries_on_organization_id"
  end

  create_table "entry_items", force: :cascade do |t|
    t.bigint "entry_id"
    t.bigint "amount_in_cents", default: 0, null: false
    t.string "amount_currency", default: "USD", null: false
    t.string "type"
    t.bigint "account_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "memo"
    t.string "payable_type"
    t.bigint "payable_id"
    t.index ["account_id"], name: "index_entry_items_on_account_id"
    t.index ["entry_id"], name: "index_entry_items_on_entry_id"
    t.index ["payable_type", "payable_id"], name: "index_entry_items_on_payable_type_and_payable_id"
    t.index ["type"], name: "index_entry_items_on_type"
  end

  create_table "file_uploads", force: :cascade do |t|
    t.string "uploadable_type"
    t.bigint "uploadable_id"
    t.string "url"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "organization_id"
    t.bigint "creator_id"
    t.string "description"
    t.string "file_type"
    t.index ["creator_id"], name: "index_file_uploads_on_creator_id"
    t.index ["organization_id"], name: "index_file_uploads_on_organization_id"
    t.index ["uploadable_type", "uploadable_id"], name: "index_file_uploads_on_uploadable_type_and_uploadable_id"
  end

  create_table "invoices", id: :serial, force: :cascade do |t|
    t.string "number"
    t.date "date"
    t.text "description"
    t.date "due_date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "slug"
    t.string "invoiceable_type"
    t.bigint "invoiceable_id"
    t.string "file_url"
    t.string "aasm_state"
    t.bigint "organization_id"
    t.boolean "paid", default: false
    t.string "final_payment_url"
    t.bigint "creator_id"
    t.text "notes"
    t.bigint "account_object_id"
    t.bigint "address_id"
    t.index ["aasm_state"], name: "index_invoices_on_aasm_state"
    t.index ["account_object_id"], name: "index_invoices_on_account_object_id"
    t.index ["address_id"], name: "index_invoices_on_address_id"
    t.index ["creator_id"], name: "index_invoices_on_creator_id"
    t.index ["date"], name: "index_invoices_on_date"
    t.index ["due_date"], name: "index_invoices_on_due_date"
    t.index ["invoiceable_type", "invoiceable_id"], name: "index_invoices_on_invoiceable_type_and_invoiceable_id"
    t.index ["number", "invoiceable_type", "invoiceable_id"], name: "index_invoices_on_number_and_invoiceable", unique: true, where: "((aasm_state)::text <> 'voided'::text)"
    t.index ["number"], name: "index_invoices_on_number"
    t.index ["organization_id"], name: "index_invoices_on_organization_id"
    t.index ["slug", "invoiceable_type", "invoiceable_id"], name: "index_invoices_on_slug_invoiceable", unique: true
    t.index ["slug"], name: "index_invoices_on_slug"
  end

  create_table "monthly_detail_reports", force: :cascade do |t|
    t.date "start_date"
    t.date "end_date"
    t.string "name"
    t.string "subtitle"
    t.string "accounting_method", default: "Cash"
    t.string "display_columns_by", default: "Total"
    t.boolean "show_active_columns", default: true
    t.boolean "show_active_rows", default: true
    t.jsonb "data", default: {}
    t.bigint "organization_id"
    t.string "status", default: "New"
    t.text "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "slug"
    t.index ["organization_id"], name: "index_monthly_detail_reports_on_organization_id"
    t.index ["slug", "organization_id"], name: "index_monthly_detail_reports_on_slug_and_organization_id", unique: true
    t.index ["slug"], name: "index_monthly_detail_reports_on_slug"
  end

  create_table "organization_assignments", id: :serial, force: :cascade do |t|
    t.integer "user_id"
    t.integer "organization_id"
    t.string "type"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "role", default: "None", null: false
    t.jsonb "permissions", default: {}, null: false
    t.index ["organization_id", "user_id"], name: "index_organization_assignments_on_organization_id_and_user_id"
    t.index ["organization_id"], name: "index_organization_assignments_on_organization_id"
    t.index ["permissions"], name: "index_organization_assignments_on_permissions", using: :gin
    t.index ["user_id"], name: "index_organization_assignments_on_user_id"
  end

  create_table "organizations", id: :serial, force: :cascade do |t|
    t.string "name"
    t.string "description"
    t.string "email"
    t.string "phone"
    t.string "subdomain"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "slug"
    t.string "alias"
    t.boolean "archived"
    t.boolean "independent"
    t.index ["alias"], name: "index_organizations_on_alias"
    t.index ["archived"], name: "index_organizations_on_archived"
    t.index ["independent"], name: "index_organizations_on_independent"
    t.index ["name"], name: "index_organizations_on_name", unique: true
    t.index ["slug"], name: "index_organizations_on_slug"
    t.index ["subdomain"], name: "index_organizations_on_subdomain", unique: true
  end

  create_table "payments", id: :serial, force: :cascade do |t|
    t.integer "invoice_id"
    t.boolean "final_pay"
    t.date "date"
    t.integer "tax_amount_in_cents", default: 0
    t.integer "shipping_amount_in_cents", default: 0
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "payable_type"
    t.bigint "payable_id"
    t.bigint "address_id"
    t.integer "creator_id"
    t.bigint "bank_account_item_id"
    t.bigint "entry_item_id"
    t.index ["address_id"], name: "index_payments_on_address_id"
    t.index ["bank_account_item_id"], name: "index_payments_on_bank_account_item_id"
    t.index ["creator_id"], name: "index_payments_on_creator_id"
    t.index ["entry_item_id"], name: "index_payments_on_entry_item_id"
    t.index ["invoice_id"], name: "index_payments_on_invoice_id"
    t.index ["payable_type", "payable_id"], name: "index_payments_on_payable_type_and_payable_id"
  end

  create_table "phones", id: :serial, force: :cascade do |t|
    t.string "number"
    t.string "type"
    t.integer "phoneable_id"
    t.string "phoneable_type"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["phoneable_type", "phoneable_id"], name: "index_phones_on_phoneable_type_and_phoneable_id"
  end

  create_table "printer_settings", force: :cascade do |t|
    t.string "name"
    t.string "slug"
    t.string "printer_type"
    t.integer "payee_offset_x", default: 0
    t.integer "payee_offset_y", default: 0
    t.integer "date_offset_x", default: 0
    t.integer "date_offset_y", default: 0
    t.integer "amount_offset_x", default: 0
    t.integer "amount_offset_y", default: 0
    t.integer "memo_offset_x", default: 0
    t.integer "memo_offset_y", default: 0
    t.integer "signature_offset_x", default: 0
    t.integer "signature_offset_y", default: 0
    t.integer "amount_text_offset_x", default: 0
    t.integer "amount_text_offset_y", default: 0
    t.integer "check_margin", default: 0
    t.bigint "organization_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "micr_offset_x", default: 0
    t.integer "micr_offset_y", default: 0
    t.integer "voucher1_offset_y", default: 0
    t.integer "voucher2_offset_y", default: 0
    t.integer "invoice_no_x", default: 0
    t.integer "invoice_no_y", default: 0
    t.integer "invoice_date_x", default: 0
    t.integer "invoice_date_y", default: 0
    t.integer "invoice_amount_x", default: 0
    t.integer "invoice_amount_y", default: 0
    t.integer "invoice_amount_paid_x", default: 0
    t.integer "invoice_amount_paid_y", default: 0
    t.integer "invoice_description_x", default: 0
    t.integer "invoice_description_y", default: 0
    t.string "direction", default: "ASC"
    t.index ["name", "organization_id"], name: "index_printer_settings_on_name_and_organization_id", unique: true
    t.index ["organization_id"], name: "index_printer_settings_on_organization_id"
    t.index ["slug", "organization_id"], name: "index_printer_settings_on_slug_and_organization_id", unique: true
    t.index ["slug"], name: "index_printer_settings_on_slug"
  end

  create_table "profit_and_loss_by_resource", force: :cascade do |t|
    t.date "start_date"
    t.date "end_date"
    t.jsonb "data", default: {}
    t.bigint "organization_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["organization_id"], name: "index_profit_and_loss_by_resource_on_organization_id"
  end

  create_table "purchase_order_categories", force: :cascade do |t|
    t.string "name"
    t.bigint "purchase_order_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["purchase_order_id"], name: "index_purchase_order_categories_on_purchase_order_id"
  end

  create_table "purchase_order_items", force: :cascade do |t|
    t.bigint "purchase_order_id"
    t.integer "quantity", default: 0
    t.string "description"
    t.integer "price_in_cents", default: 0, null: false
    t.string "price_currency", default: "USD", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "order", default: 0
    t.index ["purchase_order_id"], name: "index_purchase_order_items_on_purchase_order_id"
  end

  create_table "purchase_orders", id: :serial, force: :cascade do |t|
    t.integer "vendor_id"
    t.string "number"
    t.date "date_needed"
    t.string "buyer"
    t.string "requisition_number"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "invoice_id"
    t.string "slug"
    t.string "file_url"
    t.string "aasm_state"
    t.date "quote_date"
    t.date "proposal_date"
    t.string "quote_number"
    t.string "proposal_number"
    t.string "reference_number"
    t.text "payment_terms"
    t.bigint "address_id"
    t.bigint "vendor_address_id"
    t.integer "tax_amount_in_cents", default: 0, null: false
    t.string "tax_amount_currency", default: "USD", null: false
    t.integer "shipping_amount_in_cents", default: 0, null: false
    t.string "shipping_amount_currency", default: "USD", null: false
    t.bigint "creator_id"
    t.date "date"
    t.bigint "organization_id"
    t.bigint "requested_by_id"
    t.bigint "requested_for_id"
    t.index ["address_id"], name: "index_purchase_orders_on_address_id"
    t.index ["creator_id"], name: "index_purchase_orders_on_creator_id"
    t.index ["invoice_id", "vendor_id"], name: "index_purchase_orders_on_invoice_id_and_vendor_id"
    t.index ["invoice_id"], name: "index_purchase_orders_on_invoice_id"
    t.index ["number", "vendor_id"], name: "index_purchase_orders_on_number_and_vendor_id", unique: true
    t.index ["organization_id"], name: "index_purchase_orders_on_organization_id"
    t.index ["requested_by_id"], name: "index_purchase_orders_on_requested_by_id"
    t.index ["requested_for_id"], name: "index_purchase_orders_on_requested_for_id"
    t.index ["slug", "vendor_id"], name: "index_purchase_orders_on_slug_and_vendor_id", unique: true
    t.index ["slug"], name: "index_purchase_orders_on_slug"
    t.index ["vendor_address_id"], name: "index_purchase_orders_on_vendor_address_id"
    t.index ["vendor_id"], name: "index_purchase_orders_on_vendor_id"
  end

  create_table "reconciliations", force: :cascade do |t|
    t.bigint "organization_id"
    t.bigint "reconcilable_id"
    t.bigint "statement_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "reconcilable_item_id"
    t.string "reconcilable_item_type"
    t.string "reconcilable_type"
    t.index ["organization_id"], name: "index_reconciliations_on_organization_id"
    t.index ["reconcilable_id", "reconcilable_type"], name: "index_reconciliations_on_reconcilable"
    t.index ["reconcilable_item_id", "reconcilable_item_type"], name: "index_reconciliations_on_reconcilable_item"
    t.index ["statement_id"], name: "index_reconciliations_on_statement_id"
  end

  create_table "report_ap_aging_reports", force: :cascade do |t|
    t.date "start_date"
    t.date "end_date"
    t.string "aging_method", default: "CURRENT"
    t.integer "days_per_period", default: 30
    t.boolean "show_active_columns", default: true
    t.boolean "show_active_rows", default: true
    t.integer "periods", default: 3
    t.jsonb "data", default: {}
    t.bigint "organization_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["organization_id"], name: "index_report_ap_aging_reports_on_organization_id"
  end

  create_table "report_ar_aging_reports", force: :cascade do |t|
    t.date "start_date"
    t.date "end_date"
    t.string "aging_method", default: "CURRENT"
    t.integer "days_per_period", default: 30
    t.boolean "show_active_columns", default: true
    t.boolean "show_active_rows", default: true
    t.integer "periods", default: 3
    t.jsonb "data", default: {}
    t.bigint "organization_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["organization_id"], name: "index_report_ar_aging_reports_on_organization_id"
  end

  create_table "report_balance_sheet_by_months", force: :cascade do |t|
    t.date "start_date", default: "2019-10-26"
    t.date "end_date", default: "2020-10-25"
    t.json "data", default: {"account_search_params"=>{}}
    t.bigint "organization_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["organization_id"], name: "index_report_balance_sheet_by_months_on_organization_id"
  end

  create_table "report_balance_sheet_by_resources", force: :cascade do |t|
    t.date "start_date", default: "2019-10-26"
    t.date "end_date", default: "2020-10-25"
    t.json "data", default: {"account_search_params"=>{}}
    t.bigint "organization_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["organization_id"], name: "index_report_balance_sheet_by_resources_on_organization_id"
  end

  create_table "report_balance_sheets", force: :cascade do |t|
    t.date "start_date"
    t.date "end_date"
    t.jsonb "data", default: {}
    t.bigint "organization_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["organization_id"], name: "index_report_balance_sheets_on_organization_id"
  end

  create_table "report_budget_vs_actual_reports", force: :cascade do |t|
    t.date "start_date"
    t.date "end_date"
    t.jsonb "data", default: {}
    t.bigint "organization_id"
    t.bigint "account_fund_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["account_fund_id"], name: "index_report_budget_vs_actual_reports_on_account_fund_id"
    t.index ["organization_id"], name: "index_report_budget_vs_actual_reports_on_organization_id"
  end

  create_table "report_cash_flow_reports", force: :cascade do |t|
    t.date "start_date"
    t.date "end_date"
    t.string "display_columns_by", default: "Total"
    t.boolean "show_active_columns", default: true
    t.boolean "show_active_rows", default: true
    t.jsonb "data", default: {}
    t.bigint "organization_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["organization_id"], name: "index_report_cash_flow_reports_on_organization_id"
  end

  create_table "report_comparative_balance_sheets", force: :cascade do |t|
    t.date "start_date", default: "2021-02-15"
    t.date "end_date", default: "2022-02-14"
    t.jsonb "data", default: {}
    t.bigint "organization_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["organization_id"], name: "index_comparative_balance_sheets_on_organization_id"
  end

  create_table "report_comparative_profit_and_loss_statements", force: :cascade do |t|
    t.date "start_date", default: "2021-02-15"
    t.date "end_date", default: "2022-02-14"
    t.jsonb "data", default: {}
    t.bigint "organization_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["organization_id"], name: "index_comparative_profit_loss_statements_on_organization_id"
  end

  create_table "report_dashboards", force: :cascade do |t|
    t.date "start_date"
    t.date "end_date"
    t.json "data"
    t.bigint "organization_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "fund_code"
    t.index ["organization_id"], name: "index_report_dashboards_on_organization_id"
  end

  create_table "report_monthly_cash_flow_reports", force: :cascade do |t|
    t.date "start_date"
    t.date "end_date"
    t.jsonb "data", default: {}, null: false
    t.bigint "organization_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["organization_id"], name: "index_report_monthly_cash_flow_reports_on_organization_id"
  end

  create_table "report_monthly_profit_loss_statements", force: :cascade do |t|
    t.date "start_date"
    t.date "end_date"
    t.jsonb "data", default: {}
    t.bigint "organization_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["organization_id"], name: "index_report_monthly_profit_loss_statements_on_organization_id"
  end

  create_table "report_profit_and_loss_statements", force: :cascade do |t|
    t.date "start_date"
    t.date "end_date"
    t.jsonb "data", default: {}
    t.bigint "organization_id"
    t.bigint "account_fund_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["account_fund_id"], name: "index_report_profit_and_loss_statements_on_account_fund_id"
    t.index ["organization_id"], name: "index_report_profit_and_loss_statements_on_organization_id"
  end

  create_table "report_vendor1099_reports", force: :cascade do |t|
    t.date "start_date"
    t.date "end_date"
    t.jsonb "data", default: {}
    t.bigint "organization_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["organization_id"], name: "index_report_vendor1099_reports_on_organization_id"
  end

  create_table "report_vendor_reports", force: :cascade do |t|
    t.date "start_date"
    t.date "end_date"
    t.jsonb "data", default: {}
    t.bigint "organization_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["organization_id"], name: "index_report_vendor_reports_on_organization_id"
  end

  create_table "state_change_logs", force: :cascade do |t|
    t.bigint "user_id"
    t.string "loggable_type"
    t.bigint "loggable_id"
    t.text "reason"
    t.string "from_state"
    t.string "to_state"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "event"
    t.index ["created_at"], name: "index_state_change_logs_on_created_at"
    t.index ["loggable_type", "loggable_id"], name: "index_state_change_logs_on_loggable_type_and_loggable_id"
    t.index ["updated_at"], name: "index_state_change_logs_on_updated_at"
    t.index ["user_id"], name: "index_state_change_logs_on_user_id"
  end

  create_table "statements", force: :cascade do |t|
    t.bigint "organization_id"
    t.date "started_at"
    t.date "ended_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "starting_balance_in_cents", default: 0, null: false
    t.string "starting_balance_currency", default: "USD", null: false
    t.integer "ending_balance_in_cents", default: 0, null: false
    t.string "ending_balance_currency", default: "USD", null: false
    t.integer "adjustment_amount_in_cents", default: 0, null: false
    t.string "adjustment_amount_currency", default: "USD", null: false
    t.date "adjustment_date"
    t.integer "creator_id"
    t.string "file_url"
    t.string "statementable_type"
    t.bigint "statementable_id"
    t.string "aasm_state"
    t.index ["aasm_state"], name: "index_statements_on_aasm_state"
    t.index ["creator_id"], name: "index_statements_on_creator_id"
    t.index ["organization_id"], name: "index_statements_on_organization_id"
    t.index ["statementable_type", "statementable_id"], name: "index_statements_on_statementable_type_and_statementable_id"
  end

  create_table "ten_ninety_nines", force: :cascade do |t|
    t.bigint "address_id"
    t.integer "year"
    t.string "ein"
    t.string "ein_type"
    t.string "file_url"
    t.boolean "required", default: false
    t.bigint "vendor_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["address_id"], name: "index_ten_ninety_nines_on_address_id"
    t.index ["vendor_id"], name: "index_ten_ninety_nines_on_vendor_id"
  end

  create_table "user_group_assignments", force: :cascade do |t|
    t.bigint "user_group_id"
    t.bigint "user_id"
    t.bigint "organization_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["organization_id", "user_id", "user_group_id"], name: "org_user_group_assignments"
    t.index ["organization_id"], name: "index_user_group_assignments_on_organization_id"
    t.index ["user_group_id"], name: "index_user_group_assignments_on_user_group_id"
    t.index ["user_id"], name: "index_user_group_assignments_on_user_id"
  end

  create_table "user_groups", force: :cascade do |t|
    t.string "name"
    t.bigint "parent_id"
    t.bigint "organization_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.jsonb "module_permissions", default: {"Report"=>"Viewer", "Vendor"=>"Viewer", "Account"=>"Viewer", "Customer"=>"Viewer", "CreditCard"=>"Viewer", "BankAccount"=>"Viewer", "BatchUpload"=>"Viewer", "approval_amount"=>0}, null: false
    t.boolean "archived", default: false
    t.index ["module_permissions"], name: "index_user_groups_on_module_permissions", using: :gin
    t.index ["organization_id"], name: "index_user_groups_on_organization_id"
    t.index ["parent_id"], name: "index_user_groups_on_parent_id"
  end

  create_table "user_school_assignments", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "organization_id"
    t.bigint "account_fund_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["account_fund_id"], name: "index_user_school_assignments_on_account_fund_id"
    t.index ["organization_id"], name: "index_user_school_assignments_on_organization_id"
    t.index ["user_id"], name: "index_user_school_assignments_on_user_id"
  end

  create_table "users", id: :serial, force: :cascade do |t|
    t.string "first_name", default: "", null: false
    t.string "last_name", default: "", null: false
    t.string "email", default: "", null: false
    t.boolean "super_admin", default: false, null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet "current_sign_in_ip"
    t.inet "last_sign_in_ip"
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string "unconfirmed_email"
    t.integer "failed_attempts", default: 0, null: false
    t.string "unlock_token"
    t.datetime "locked_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "back_office", default: false
    t.string "avatar_url"
    t.string "slug"
    t.boolean "archived"
    t.jsonb "preferences", default: {"email_notifications"=>"summary"}
    t.boolean "ap", default: false, null: false
    t.boolean "upload_only", default: false, null: false
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["slug"], name: "index_users_on_slug"
    t.index ["unlock_token"], name: "index_users_on_unlock_token", unique: true
  end

  create_table "vendors", id: :serial, force: :cascade do |t|
    t.string "company"
    t.text "notes"
    t.string "email"
    t.string "other"
    t.string "website"
    t.string "account_number"
    t.boolean "active"
    t.text "payment_terms"
    t.boolean "global"
    t.integer "rating"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "title"
    t.string "first_name"
    t.string "middle_name"
    t.string "last_name"
    t.string "suffix"
    t.integer "organization_id"
    t.string "slug"
    t.string "logo_url"
    t.string "aasm_state"
    t.string "file_url"
    t.date "start_date"
    t.date "end_date"
    t.integer "starting_balance_in_cents", default: 0, null: false
    t.string "starting_balance_currency", default: "USD", null: false
    t.bigint "creator_id"
    t.string "primary_phone"
    t.index ["aasm_state"], name: "index_vendors_on_aasm_state"
    t.index ["company", "title", "first_name", "last_name", "suffix"], name: "index_vendors_on_name"
    t.index ["creator_id"], name: "index_vendors_on_creator_id"
    t.index ["organization_id"], name: "index_vendors_on_organization_id"
    t.index ["slug", "organization_id"], name: "index_vendors_on_slug_and_organization_id", unique: true
    t.index ["slug"], name: "index_vendors_on_slug"
  end

  add_foreign_key "account_functions", "organizations"
  add_foreign_key "account_funds", "organizations"
  add_foreign_key "account_goals", "organizations"
  add_foreign_key "account_locations", "organizations"
  add_foreign_key "account_objects", "organizations"
  add_foreign_key "account_resources", "organizations"
  add_foreign_key "account_years", "organizations"
  add_foreign_key "accounts", "account_functions"
  add_foreign_key "accounts", "account_funds"
  add_foreign_key "accounts", "account_goals"
  add_foreign_key "accounts", "account_locations"
  add_foreign_key "accounts", "account_objects"
  add_foreign_key "accounts", "account_resources"
  add_foreign_key "accounts", "account_years"
  add_foreign_key "accounts", "organizations"
  add_foreign_key "ap_file_download_logs", "file_uploads"
  add_foreign_key "ap_file_download_logs", "users"
  add_foreign_key "authorizations", "user_groups"
  add_foreign_key "authorizations", "users"
  add_foreign_key "bank_account_items", "addresses"
  add_foreign_key "bank_account_items", "bank_accounts"
  add_foreign_key "bank_account_items", "entries"
  add_foreign_key "bank_account_items", "users", column: "creator_id"
  add_foreign_key "bank_accounts", "account_objects"
  add_foreign_key "bank_accounts", "organizations"
  add_foreign_key "bank_accounts", "users", column: "creator_id"
  add_foreign_key "batch_uploads", "organizations"
  add_foreign_key "batch_uploads", "users", column: "creator_id"
  add_foreign_key "budgets", "accounts"
  add_foreign_key "credit_card_items", "credit_cards"
  add_foreign_key "credit_card_items", "entries"
  add_foreign_key "credit_card_items", "users", column: "creator_id"
  add_foreign_key "credit_cards", "organizations"
  add_foreign_key "credit_cards", "users", column: "creator_id"
  add_foreign_key "customers", "organizations"
  add_foreign_key "customers", "users", column: "creator_id"
  add_foreign_key "denial_notifications", "organizations"
  add_foreign_key "denial_notifications", "users"
  add_foreign_key "entries", "organizations"
  add_foreign_key "entries", "users", column: "creator_id"
  add_foreign_key "entry_items", "accounts"
  add_foreign_key "entry_items", "entries"
  add_foreign_key "file_uploads", "organizations"
  add_foreign_key "file_uploads", "users", column: "creator_id"
  add_foreign_key "invoices", "account_objects"
  add_foreign_key "invoices", "addresses"
  add_foreign_key "invoices", "organizations"
  add_foreign_key "invoices", "users", column: "creator_id"
  add_foreign_key "organization_assignments", "organizations"
  add_foreign_key "organization_assignments", "users"
  add_foreign_key "payments", "addresses"
  add_foreign_key "payments", "invoices"
  add_foreign_key "payments", "users", column: "creator_id"
  add_foreign_key "printer_settings", "organizations"
  add_foreign_key "profit_and_loss_by_resource", "organizations"
  add_foreign_key "purchase_order_categories", "purchase_orders"
  add_foreign_key "purchase_order_items", "purchase_orders"
  add_foreign_key "purchase_orders", "addresses"
  add_foreign_key "purchase_orders", "addresses", column: "vendor_address_id"
  add_foreign_key "purchase_orders", "invoices"
  add_foreign_key "purchase_orders", "organizations"
  add_foreign_key "purchase_orders", "users", column: "creator_id"
  add_foreign_key "purchase_orders", "users", column: "requested_by_id"
  add_foreign_key "purchase_orders", "users", column: "requested_for_id"
  add_foreign_key "purchase_orders", "vendors"
  add_foreign_key "reconciliations", "organizations"
  add_foreign_key "reconciliations", "statements"
  add_foreign_key "report_balance_sheet_by_months", "organizations"
  add_foreign_key "report_balance_sheet_by_resources", "organizations"
  add_foreign_key "report_balance_sheets", "organizations"
  add_foreign_key "report_budget_vs_actual_reports", "account_funds"
  add_foreign_key "report_budget_vs_actual_reports", "organizations"
  add_foreign_key "report_comparative_balance_sheets", "organizations"
  add_foreign_key "report_comparative_profit_and_loss_statements", "organizations"
  add_foreign_key "report_dashboards", "organizations"
  add_foreign_key "report_monthly_cash_flow_reports", "organizations"
  add_foreign_key "report_monthly_profit_loss_statements", "organizations"
  add_foreign_key "report_profit_and_loss_statements", "account_funds"
  add_foreign_key "report_profit_and_loss_statements", "organizations"
  add_foreign_key "report_vendor1099_reports", "organizations"
  add_foreign_key "report_vendor_reports", "organizations"
  add_foreign_key "state_change_logs", "users"
  add_foreign_key "statements", "organizations"
  add_foreign_key "statements", "users", column: "creator_id"
  add_foreign_key "ten_ninety_nines", "addresses"
  add_foreign_key "ten_ninety_nines", "vendors"
  add_foreign_key "user_group_assignments", "organizations"
  add_foreign_key "user_group_assignments", "user_groups"
  add_foreign_key "user_group_assignments", "users"
  add_foreign_key "user_groups", "organizations"
  add_foreign_key "user_groups", "user_groups", column: "parent_id"
  add_foreign_key "user_school_assignments", "account_funds"
  add_foreign_key "user_school_assignments", "organizations"
  add_foreign_key "user_school_assignments", "users"
  add_foreign_key "vendors", "organizations"
  add_foreign_key "vendors", "users", column: "creator_id"
end
