json.array!(@vendors) do |vendor|
  json.partial! 'vendors/vendor', vendor: vendor
end
