def horizontal_sum(ary, current_col)
  start_cell = "#{column_name(current_col)}#{current_row_num + 1}"
  end_cell   = "#{column_name(current_col + ary.length - 1)}#{current_row_num + 1}"
  "=SUM(#{start_cell}:#{end_cell})"
end

def vertical_sum_for_array(sheet, horizontal_length:, vertical_length:, start_index:)
  start_row = 1 + sheet.rows.length - vertical_length
  end_row = sheet.rows.count

  Array.new(horizontal_length) do |i|
    # If there are no rows to total, just make it zero
    vertical_length == 0 ? 0.00 :
    sum_for_cell(col_index: start_index + i, row_start: start_row, row_end: end_row)
  end
end

def vertical_sum(vertical_length:, column_name:)
  start_row = 1 + current_row_num - vertical_length
  end_row = current_row_num

  vertical_length == 0 ? 0.00 : sum_for_cell(col_index: start_index + i, row_start: start_row, row_end: end_row)
end

def sum_for_cell(col_index:1, row_start:, row_end:)
  col = column_name(col_index)
  "=SUM(#{col}#{row_start}:#{col}#{row_end})"
end

# Given an Int, returns Excel column name e.g. AC
def column_name(int)
  name = "A"
  (int - 1).times { name.succ! }
  name
end

def current_sheet
  @wb.worksheets.last
end

def current_row
  current_sheet.rows.last
end

def current_row_num
  current_sheet.rows.count
end

def parse_num(num)
  num.gsub(/[\$\,]/, "").to_f
end

def cell_names_for_array(ary, start_col: 0)
  (start_col..(ary.length + start_col - 1)).to_a.map {|n| column_name n}
end
