class Types::BatchUploadType < Types::BaseObject
  include Concerns::Permissable
  include Concerns::ApprovableWithLog
  include Concerns::Authorizations

  implements Interfaces::ValidatableInterface

  field :id, ID, null: true
  field :aasm_state, String, null: true
  field :creator, Types::UserType, null: true
  field :creator_name, String, null: true
  field :user_group_name, String, null: true
  field :user_group, Types::UserGroupType, null: true
  field :files, [Types::BatchUploadFileType], null: false

  field :total_files, String, null: false
  field :approved_files, String, null: false

  field :updated_at, String, null: false
  field :created_at, String, null: false

  field :path, String, null: false
  field :edit_path, String, null: false

  def path
    "/batch_uploads/#{object.id}"
  end

  def edit_path
    context[:current_user].id == object&.creator&.id ? "#{path}/edit" : "#{path}/approve"
  end

  def created_at
    object&.created_at&.to_date&.to_formatted_s(:std_alt)
  end

  def updated_at
    object&.updated_at&.to_date&.to_formatted_s(:std_alt)
  end

  def creator_name
    object&.creator&.full_name
  end

  def user_group
    context[:current_user_group]
  end

  def user_group_name
    object.creator ? object.creator.user_groups.where(organization: context[:current_org]).first&.name : ""
  end

  def total_files
    object.files.count
  end

  def approved_files
    object.files.map do |file|
      if file["path"] == "#" && (
          context[:current_user_group].approval_amount.zero? ||
          context[:current_user_group].approval_amount >= file["amount"] * 100
        )
        nil
      else
        file["approved"]
      end
    end.compact.length
  end
end
