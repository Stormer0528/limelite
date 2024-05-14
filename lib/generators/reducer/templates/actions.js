// <%= class_name %> Actions
//------------------------------------------------------------------------------

<% args[1..args.length].each do |arg|
  param = !(/^set_/ =~ arg).nil? ? arg.underscore.gsub(/^set_/, '').camelcase(:lower) : ''

%>export function <%= arg.camelcase :lower %>(<%= param %>){
  return {type: '<%= arg.underscore.upcase%>'<%= (param && ", #{param}") || '' %> };
}
<% end %>
