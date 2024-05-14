module Report
  def self.table_name_prefix
    "report_"
  end

  def self.policy_class
    ReportPolicy
  end
end
