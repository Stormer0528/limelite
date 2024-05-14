class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  def gid
    GraphQL::Schema::UniqueWithinType.encode("#{self.class.name}Type", id)
  end
end
