// <%= class_name %> Store
//------------------------------------------------------------------------------

function <%=class_name %>Store(state = [], action) {
  switch(action.type){
    <% args[1..args.length].each do |method_name|
    param = !(/^set_/ =~ method_name).nil? ? method_name.underscore.gsub(/^set_/, '').camelcase(:lower) : nil

  %>case '<%= method_name.underscore.upcase%>':
      return Object.assign({}, state, { <%= (param && "#{param}: action.#{param}" || "/* modified Object */") %> });
    <% end %>
    default:
      return state;
  }
}

export default <%=class_name %>Store;
