module Resolvers
  class BankStatementResolver < Resolvers::BaseSearchResolver
    include SearchObject.module(:graphql)

    type [Types::StatementType]
    description "Find Bank Account Statements"

    scope { context[:current_org].statements.order(started_at: :asc) }

    # Options
    option(:statementable_slug, type: types.String) do |scope, value|
      statementable_ids = [BankAccount, CreditCard].map {|klass| klass.where(slug: value).map(&:id) }.flatten.uniq
      unless value.blank? || statementable_ids.empty?
        scope.where(statementable_id: statementable_ids)
      end
    end

    option(:statementable_id, type: types.ID) {|scope, value|
      scope.where(statementable_id: value) unless value.blank?
    }
    option(:statementable_type, type: types.String) {|scope, value|
      scope.where(statementable_type: value) unless value.blank?
    }
    option(:ending_before, type: types.String) {|scope, value|
      scope.dated_before(Date.parse(value)) unless value.blank?
    }
    option(:ending_after, type: types.String) {|scope, value|
      scope.dated_after(Date.parse(value)) unless value.blank?
    }
  end
end
