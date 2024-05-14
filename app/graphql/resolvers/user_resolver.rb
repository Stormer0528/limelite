module Resolvers
  class UserResolver < Resolvers::BaseSearchResolver
    type types[Types::UserType]
    description "Find Users"

    scope { context[:current_org].users }

    option(:name, type: types.String) {|scope, value| scope.by_partial_name(value) unless value.blank? }
    option(:email, type: types.String) {|scope, value| scope.by_partial_email(value) unless value.blank? }

    option(:admin, type: types.Boolean) do |scope, value|
      unless value.nil?
        if value == false
          scope.non_admin
        elsif value == true
          scope.admin
        end
      end
    end

    option(:archived, type: types.Boolean) do |scope, value|
      value ? scope.archived : scope.unarchived
    end

    option(:role, type: types.String) {|scope, value| scope.by_role(value) unless value.blank? }
    option(:organization_id, type: types.ID) {|scope, value| scope.by_organization(value) unless value.blank? }
    option(:type, type: types.String) do |scope, value|
      unless value.blank?
        value = "#{value}Assignment" unless value =~ /Assignment/
        scope.by_role(value)
      end
    end
  end
end
