RSpec.shared_examples "report_base" do
  it "should respond to #run_report" do
    expect(subject).to respond_to :run_report
  end

  it "should respond to report base fields" do
    expect(subject).to respond_to(:organization_id)
    expect(subject).to respond_to(:start_date)
    expect(subject).to respond_to(:end_date)
    expect(subject).to respond_to(:updated_at)
    expect(subject).to respond_to(:data)
    expect(subject).to respond_to(:persisted?)
  end
end
