namespace :user_school_assignment do
  desc "Seeds user school assignment"

  task seed_records: :environment do
    UserSchoolAssignment.delete_all

    AccountFund.all.each do |fund|
      organization = fund.organization
      users = {}
      organization.users.each do |user|
        if users[user.id].nil?
          users[user.id] = true

          if !user.archived
            UserSchoolAssignment.create(
              user_id: user.id,
              organization_id: organization.id,
              account_fund_id: fund.id
            )
          end
        end
      end
    end
  end

end
