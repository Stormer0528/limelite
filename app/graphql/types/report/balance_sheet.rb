class Types::Report::BalanceSheet < Types::Report::ReportBase
  implements Interfaces::AccountSearchableInterface

  field :account_fund_id, ID, null: true
  field :account_fund_name, String, null: true
  field :account_fund_code, String, null: true
  field :account_funds, [Types::Account::AccountFund], null: true
  field :organization_name, String, null: true
  field :url, String, null: true
  field :pdf_url, String, null: true
  field :xlsx_url, String, null: true

  def account_fund_id
    object.account_fund_id
  end

  def account_fund_name
    object.account_fund_name
  end

  def account_fund_code
    object.account_fund_code
  end

  def account_funds
    object.data["account_funds"]
  end

  def url
    "/export/balance-sheet/#{object.id}"
  end

  def pdf_url
    "#{url}.pdf"
  end

  def xlsx_url
    "#{url}.xlsx"
  end
end
