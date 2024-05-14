require 'rails_helper'

RSpec.describe 'FilesController', type: :routing do
  describe 'routing' do
    it 'routes to #index' do
      expect(get: "/files/index").to route_to("files#index")
    end
  end
end
