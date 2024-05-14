Rails.application.routes.draw do
  get 'files/index'
  namespace :export do
    get "/vendors/:vendor_id/purchase_orders/:id", to: "vendors/purchase_orders#show"
    resource :check_register_report,
             only: [:show],
             path: "check-register",
             to: "check_register#show"
    resource :accounts,
             only: [:show],
             path: "accounts",
             to: "accounts#show"
    resource :account_elements,
             only: [:show],
             path: "account-elements",
             to: "account_elements#show"
    resource :monthly_cash_flow_report,
             only: [:show, :destroy],
             path: "monthly-cash-flow-report/:report_id"
    resource :vendor1099_report,
             only: [:show, :destroy],
             path: "vendor-1099-report/:report_id"
    resource :vendor_report,
             only: [:show, :destroy],
             path: "vendor-report/:report_id"
    resource :ap_aging_report,
             only: [:show, :destroy],
             path: "ap-aging-report/:report_id"
    resource :ar_aging_report,
             only: [:show, :destroy],
             path: "ar-aging-report/:report_id"
    resource :monthly_profit_loss_statement,
             only: [:show, :destroy],
             path: "monthly-profit-and-loss-statement/:report_id"
    resource :comparative_profit_loss_statement,
             only: [:show, :destroy],
             path: "comparative-profit-and-loss-statement/:report_id"
    resource :comparative_balance_sheet,
             only: [:show, :destroy],
             path: "comparative-balance-sheet/:report_id"
    resource :profit_and_loss_statement,
             only: [:show, :destroy],
             path: "profit-and-loss-statement/:report_id"
    resource :balance_sheet,
             only: [:show, :destroy],
             path: "balance-sheet/:report_id"
    resource :balance_sheet_by_month,
             only: [:show, :destroy],
             path: "balance-sheet-by-month/:report_id"
    resource :balance_sheet_by_resource,
             only: [:show, :destroy],
             path: "balance-sheet-by-resource/:report_id"
    resource :cash_flow_report,
             only: %i[show update destroy],
             path: "cash-flow-report/:report_id"
    resource :profit_and_loss_by_resource_report,
             only: %i[show update destroy],
             path: "profit-and-loss-by-resource-report/:report_id"
    resource :budget_vs_actual_report,
             only: %i[show update destroy],
             path: "budget-vs-actual/:report_id"
  end

  resources :printer_settings
  resources :batch_payments, only: %i[index create]
  resources :account_years, :account_resources, :account_objects,
            :account_locations, :account_goals, :account_functions,
            :account_funds, except: [:show]

  resources :bank_accounts, except: [:show] do
    get "print", to: "bank_accounts/print#show"
    post "print_checks/print",     to: "print_checks#print"
    get  "reconciliations/:id/export", to: "statements#show"
    delete "reconciliations/:id", to: "statements#destroy"
    get "reconciliations/:id/version/:version_id/export", to: "statements#version_show"
  end

  resources :batch_uploads, only: :index
  get "batch_uploads/*other", to: "batch_uploads#index"

  # Reroute to index for react router
  get "bank_accounts/*other", to: "bank_accounts#index"

  get "reconciliations", to: "statements#index"
  get "reconciliations/*other", to: "statements#index"

  resources :bank_accounts, except: [:show] do
    resources :account_transfers, :checks, :deposits,
              except: %i[index],
              module: "bank_accounts"
  end

  resources :credit_cards, except: [:show] do
    get "print", to: "credit_cards/print#show"
    delete "reconciliations/:id", to: "statements#destroy"
    get "reconciliations/:id/export", to: "statements#show"
    get "reconciliations/:id/version/:version_id/export", to: "statements#version_show"
  end

  # Reroute to index for react router
  get "credit_cards/*other", to: "credit_cards#index"

  resources :vendors do
    get "/invoices/new/:purchase_order_id", to: "vendors/invoices#new"
    resources :invoices, module: :vendors, except: [:index] do
      resources :payments, except: %i[index edit update destroy]
    end

    get "/purchase_orders", to: "vendors/purchase_orders#index"
    get "/purchase_orders/*other", to: "vendors/purchase_orders#index"
    resources :purchase_orders, module: :vendors, only: [:create, :update] do
      get "/:id/export", to: "export/vendors/purchase_orders#show"
      get "/*other", to: "purchase_orders#index"
    end
  end

  resources :customers do
    resources :invoices, module: :customers, except: [:index] do
      resources :payments, except: %i[index edit update destroy]
    end
  end

  mount GraphiQL::Rails::Engine, at: "/graphiql", graphql_path: "/graphql" if Rails.env.development?

  post "/graphql", to: "graphql#execute"

  resources :organizations

  get "entries/print", to: "entries/print#show"
  resources :entries do
    get :duplicate, to: "entries#duplicate", as: :duplicate
  end

  resources :accounts, except: [:new]

  # Users
  get "user", to: "user#show"
  get "/logged_in", to: "user#logged_in", defaults: {format: "json"}

  devise_scope :user do
    get "/signout", to: "devise/sessions#destroy"
  end
  devise_for :users

  scope :admin do
    get "/", to: "admin#index", as: :admin
    get "approval-logs", to: "approval_logs#index", as: :report_logs
    get "import-entries", to: "entry_imports#index", as: :import_entries
    post "import-entries", to: "entry_imports#create", as: :create_entry_upload
  end

  # Reports
  get "/reports", to: "report#index", as: :reports
  get "reports/*other", to: "report#index"
  namespace :admin do
    resources :users
  end

  get "/dashboard", to: "static_pages#dashboard", as: "dashboard"
  scope :files do
    get "/menu", to: "files#menu"
    get "/", to: "files#index"
    get "/new", to: "files#new"
  end
  get "/archived", to: "static_pages#archived", as: "archived"
  get "/independent", to: "static_pages#independent", as: "independent"

  root to: "static_pages#home"
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
