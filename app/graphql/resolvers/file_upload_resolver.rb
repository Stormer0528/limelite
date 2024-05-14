module Resolvers
  class FileUploadResolver < Resolvers::BaseSearchResolver
    type [Types::FileUploadType]
    description "Find/Filter File Uploads"

    scope { context[:current_org] ? context[:current_org].file_uploads : FileUpload.includes(:ap_file_download_logs).all }

    # Options
    option(:id, type: types.ID)
    option(:creator_id, type: types.ID)
    option(:uploadable_id, type: types.ID)
    option(:uploadable_type, type: types.String)
    option(:description, type: types.String) {|scope, value| scope.by_partial_description(value) if value }
    option(:file_type, type: types.String) {|scope, value| scope.by_partial_file_type(value) if value }
    option(:unarchived, type: types.Boolean) {|scope, value| scope.unarchived if value}

    OrderEnum = GraphQL::EnumType.define do
      name "FileUploadOrder"

      value "CREATED_AT"
      value "UPDATED_AT"
      value "FILE_TYPE"
      value "UPLOADABLE_TYPE"
      value "DESCRIPTION"
    end

    option :order, type: OrderEnum, default: "CREATED_AT"

    def apply_order_with_created_at(scope)
      scope.order "file_uploads.created_at DESC"
    end

    def apply_order_with_updated_at(scope)
      scope.order "file_uploads.updated_at DESC"
    end

    def apply_order_with_file_type(scope)
      scope.order "file_uploads.file_type DESC"
    end

    def apply_order_with_uploadable_type(scope)
      scope.order "file_uploads.uploadable_type DESC"
    end

    def apply_order_with_description(scope)
      scope.order "file_uploads.description DESC"
    end
  end
end
