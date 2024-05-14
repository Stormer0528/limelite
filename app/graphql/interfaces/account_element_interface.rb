module Interfaces::AccountElementInterface
  include Types::BaseInterface

  field :id, ID, null: false
  field :name, String, null: false
  field :code, String, null: false
  field :organization_id, ID, null: false
end
