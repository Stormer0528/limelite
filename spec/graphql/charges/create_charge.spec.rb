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

  context "Mutations" do
    context "create_charge.gql" do
      before do
        query_string = get_mutation("create_charge.gql")
        account_fund     = FactoryBot.create(:account_fund, organization: @org)
        account_resource = FactoryBot.create(:account_resource, organization: @org)
        account1 = FactoryBot.create(:account, organization: @org, account_fund: account_fund,
                                               account_resource: account_resource)
        account2 = FactoryBot.create(:account, organization: @org, account_fund: account_fund,
                                               account_resource: account_resource)

        @result = SavantCoSchema.execute(
          query_string,
          context: @context,
          variables: {
            state_action: "save_draft",
            charge: {
              creditCardId: @credit_card.id,
              entryAttributes: {
                date: "Sat Mar 06 2021 16:59:00 GMT-0800 (Pacific Standard Time)",
                entryType: "Revenue",
                entryItemsAttributes: [
                  {
                    type: "Debit",
                    amount: 500,
                    memo: "First Memo",
                    accountId: account1.id
                  },
                  {
                    type: "Credit",
                    amount: 500,
                    memo: "Second Memo",
                    accountId: account2.id
                  }
                ]
              }
            }
          }
        ).to_h
      end

      it "should not have any errors in the query" do
        expect(@result["errors"] || []).to be_empty
      end

      it "should create a valid charge" do
        expect(@result.dig("data", "charge", "errors") || ["data not present"]).to be_empty
      end
    end

    xit "can update a charge"

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
