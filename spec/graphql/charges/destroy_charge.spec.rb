require "rails_helper"

RSpec.describe CreditCard::Charge, type: :graphql_query do
  before do
    @org = FactoryBot.create(:organization, subdomain: "safafa")
    @credit_card = FactoryBot.create(:credit_card, organization: @org)
    @current_user = FactoryBot.create(:super_admin_user)
    @user_role = @user_role = OrganizationAssignment.find_by(user: @current_user, organization: @current_org)
    @auth_ctx = AuthorizationContext.new(
      @current_user,
      @current_org,
      @user_role
    )

    @context = {
      current_org: @org,
      current_user: @current_user,
      auth_ctx: @auth_ctx
    }
  end

  def get_mutation(name)
    file_name = [Rails.root, "app/javascript/graphql/mutations", name].join("/")
    File.read(file_name)
  end

  context "destroy_charge.gql" do
    it "can destroy a charge" do
      # Setup
      charge = FactoryBot.create(:credit_card_charge, credit_card: @credit_card)
      charge_id = charge.id
      query_string = get_mutation("destroy_charge.gql")

      # Execute
      SavantCoSchema.execute(
        query_string,
        context: @context,
        variables: {id: charge.id}
      )

      # Test
      expect(charge_id).not_to be_nil
      expect(@credit_card.charges.find_by(id: charge_id)).to be_nil
    end
  end
end
