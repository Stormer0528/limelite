class Types::OrganizationType < Types::BaseObject
  field :id, ID, null: false
  field :name, String, null: true
  field :subdomain, String, null: true
  field :description, String, null: true
  field :email, String, null: true
  field :phone, String, null: true
  field :url, String, null: true

  def url
    [object.subdomain, context[:site_path]].join(".")
  end
end
