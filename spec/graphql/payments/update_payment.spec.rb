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

  context "update_charge.gql" do
    before do
      @query_string = get_mutation("update_charge.gql")
    end

    subject { FactoryBot.create(:credit_card_charge) }

    it "can update a charge with the same amount of items", focus: true do
      updated_attributes = {
        creditCardId: @credit_card.id,
        id: subject.id,
        fileUrl: nil,
        memo: "Updated Memo!",
        number: nil,
        entryAttributes: {
          entryItemsAttributes: [
            {
              amount: 1500,
              memo: "debit memo updated",
              type: "Debit"
            },
            {
              accountId: 4169,
              amount: 1500,
              memo: "credit memo updated",
              type: "Credit"
            }
          ],
          entryType: "Revenue",
          date: "2021-03-06T08:00:00.000Z"
        }
      }

      result = SavantCoSchema.execute(
        @query_string,
        context: @context,
        variables: {charge: updated_attributes, stateAction: "save_draft"}
      ).to_h

      # Ensure no errors in the update
      # binding.pry
      expect(result["errors"] || []).to be_empty
      expect(result.dig("data", "charge", "errors") || []).to be_empty

      # Ensure values have changed
      expect(result.dig("data", "charge", "memo")).to eql("Updated Memo!")
    end

    xit "can delete an entry item"
    xit "can add an entry item"
    xit "can update the vendor on an entry"
    xit "can change vendor to customer on an associated entry"

    xit "can move items through states" do
      # Draft
      # Needs Approval
      # Approved
      # Needs Revision
    end

    xit "can't update after an item has been reonciled"
    xit "updates reason when reason provided"
    xit "defaults state_action to save draft when none provided"
  end
end
