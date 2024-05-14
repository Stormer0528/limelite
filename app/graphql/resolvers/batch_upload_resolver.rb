module Resolvers
  class BatchUploadResolver < Resolvers::BaseSearchResolver
    type types[Types::BatchUploadFileType]
    description "Find and Filter Batch Uploads"
    scope { context[:current_org].batch_uploads.order(created_at: :desc) }

    option :aasm_state, type: types.String do |scope, value|
      states = value.split(",").map(&:strip)
      value ? scope.where(aasm_state: states) : scope
    end
  end
end
