json.account_funds do
  @account_funds.each do |elem|
    json.set! elem.code do
      json.cache! elem.cache_key, expires_in: 4.hours do
        json.partial! 'account_funds/account_fund', account_fund: elem
      end
    end
  end
end

json.account_resources do
  @account_resources.each do |elem|
    json.set! elem.code do
      json.cache! elem.cache_key, expires_in: 4.hours do
        json.partial! 'account_resources/account_resource', account_resource: elem
      end
    end
  end
end

json.account_years do
  @account_years.each do |elem| 
    json.set! elem.code do
      json.cache! elem.cache_key, expires_in: 4.hours do
        json.partial! 'account_years/account_year', account_year: elem
      end
    end
  end
end

json.account_goals do
  @account_goals.each do |elem|
    json.cache! elem.cache_key, expires_in: 4.hours do
      json.set! elem.code do
        json.partial! 'account_goals/account_goal', account_goal: elem
      end
    end
  end
end

json.account_functions do
  @account_functions.each do |elem|
    json.cache! elem.cache_key, expires_in: 4.hours do
      json.set! elem.code do
        json.partial! 'account_functions/account_function', account_function: elem
      end
    end
  end
end

json.account_objects do
  @account_objects.each do |elem|
    json.cache! elem.cache_key, expires_in: 4.hours do
      json.set! elem.code do
        json.partial! 'account_objects/account_object', account_object: elem
      end
    end
  end
end

json.account_locations do
  @account_locations.each do |elem|
    json.cache! elem.cache_key, expires_in: 4.hours do
      json.set! elem.code do
        json.partial! 'account_locations/account_location', account_location: elem
      end
    end
  end
end
