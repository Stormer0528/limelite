namespace :create_accounts do
  task :setup => :environment do
    # org = Organization.find 5
    Organization.all.each do |org|
      funds = org.account_fund_ids.map {|id| {account_fund_id: id} }
      functions = org.account_function_ids.map {|id| {account_function_id: id} }
      goals = org.account_goal_ids.map {|id| {account_goal_id: id} }
      locations = org.account_location_ids.map {|id| {account_location_id: id} }
      objects = org.account_object_ids.map {|id| {account_object_id: id} }
      resources = org.account_resource_ids.map {|id| {account_resource_id: id} }
      years = org.account_year_ids.map {|id| {account_year_id: id} }

      elements = funds.product(functions, goals, locations, resources, years)
      elements = elements.map do |elem| elem.inject({}) {|acc, e| acc.merge! e } end

      objects.in_groups_of(10, false) do |objs|
        elements.in_groups_of(100, false) do |element_group|
          batch = objs.product(element_group).map do |elem| elem.inject({}) {|acc, e| acc.merge! e } end

          org.accounts.create batch
        end
      end
    end
  end
end
