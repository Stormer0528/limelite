class Types::Report::ComparativeProfitAndLossStatement < Types::Report::ReportBase
    implements Interfaces::AccountSearchableInterface

    field :account_fund_id, ID, null: false
    field :account_fund_name, String, null: true
    field :account_fund_code, String, null: true
    field :organization_name, String, null: true
    field :colspan_width, Integer, null: true
    field :url, String, null: true
    field :pdf_url, String, null: true
    field :xlsx_url, String, null: true

    def url
      "/export/comparative-profit-and-loss-statement/#{object.id}"
    end

    def pdf_url
      "#{url}.pdf"
    end

    def xlsx_url
      "#{url}.xlsx"
    end
  end
