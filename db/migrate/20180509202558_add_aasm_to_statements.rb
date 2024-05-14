class AddAasmToStatements < ActiveRecord::Migration[5.1]
  def change
    add_column :statements, :aasm_state, :string
  end
end
