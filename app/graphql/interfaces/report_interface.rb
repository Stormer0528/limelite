module Interfaces::ReportInterface
  include Types::BaseInterface

  field :organization_id, ID, null: false
  field :start_date, String, null: true
  field :end_date, String, null: true
  field :updated_at, String, null: true
  field :data, String, null: false
  field :persisted, Boolean, null: true

  def data
    object.data.to_json
  end

  def persisted
    object.persisted?
  end

  def startDate
    object.start_date
  end

  def endDate
    object.end_date
  end
end
