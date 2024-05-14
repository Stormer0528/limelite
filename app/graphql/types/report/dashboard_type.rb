class Types::Report::DashboardType < Types::Report::ReportBase
  field :fund_code, String, null: false
  field :data, String, null: false

  def data
    object.data.to_json
  end

  def org
    context[:current_org]
  end
end
