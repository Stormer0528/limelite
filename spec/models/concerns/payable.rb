RSpec.shared_examples "Payable" do
  it { is_expected.to have_many(:payments) }
end
