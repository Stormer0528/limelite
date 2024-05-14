class EntryImportsController < ApplicationController
  include LoggableController
  before_action :create_entry_import

  def index
    authorize :entry, :create?
  end

  def create
    authorize :entry, :create?

    unless entry_upload_params[:file_upload]&.tempfile
      @entry_import.add_error("Unable to read upload file")
      render "index"
      return
    end

    path = entry_upload_params[:file_upload].tempfile.path
    workbook = RubyXL::Parser.parse path

    # Find active sheet in excel
    active_sheet = workbook.worksheets.find do |sheet|
      sheet.sheet_views.map(&:tab_selected).include?(true)
    end

    # Initialize Entry
    @entry = @current_org.entries.new(
      date: entry_upload_params[:date] || DateTime.now,
      entry_type: entry_upload_params[:entry_type],
      file_url: entry_upload_params[:file_url],
      creator: @current_user
    )

    amount_by_resource = {}
    total_amount = 0

    # loop through rows and add entry_items
    active_sheet.each_with_index do |row, index|
      if row && row.cells.present?
        next if row[0].nil? || row[0].value == "Entry Account"
        account_id = nil

        account = @current_org.accounts.by_number(row[0].value).first

        codes = Hash.new
        row[0].value.split(Account::CODE_SEPARATOR).each_with_index do |code, index|
          codes[Account::ELEMENTS[index].to_sym] = code
        end

        if account
          account_id = account.id
        else
          codes.merge!(organization_id: @current_org.id)
          account = Account.create_with_partial_code(codes)
          account_id = account&.id
        end

        resource_id = account&.account_resource_id

        attribs = account.attributes
        Account::ELEMENTS.each do |elem|
          key = "account_#{elem}_id"
          @entry_import.add_error("Account #{elem} (#{codes[elem.to_sym]}) not created in Limelite") unless attribs[key]
        end

        @entry_import.add_error("Negative Debit on row #{index}")  if row[2]&.value&.negative?
        @entry_import.add_error("Negative Credit on row #{index}") if row[3]&.value&.negative?
        @entry_import.add_error("Nothing in the cell for debit or credit") if row[2]&.value.blank? && row[3]&.value.blank?

        entry_item = {
          type: (row[2]&.value.blank? || row[2].value.to_f <= 0) ? "Credit" : "Debit",
          amount:     (row[2]&.value.blank? || row[2].value.to_f <= 0) ? row[3]&.value : row[2]&.value,
          memo:       row[1]&.value,
          account_id: account_id
        }

        resource_code = codes[:resource]

        if !amount_by_resource.has_key? resource_code
          amount_by_resource[resource_code] = 0
        end

        if entry_item[:amount].is_a? Numeric
          if entry_item[:type] == "Credit"
            total_amount += entry_item[:amount]
            amount_by_resource[resource_code] += entry_item[:amount]
          else
            total_amount -= entry_item[:amount]
            amount_by_resource[resource_code] -= entry_item[:amount]
          end
        end

        @entry.entry_items.new entry_item
      end
    end

    if total_amount > 0.001
      @entry_import.add_error("Entry does not balance (debits = credits)")
    end

    amount_by_resource.each do |key, value|
      if value > 0.001
        @entry_import.add_error("Resource(#{key}) does not balance")
      end
    end

    respond_to do |format|
      if @entry_import.errors.empty? && update_state(@entry)
        format.html { redirect_to @entry, notice: "Entries Imported" }
        format.json { render :show, status: :created, location: @entry }
      else
        format.html { render :index }
        format.json { render json: @entry_import.errors, status: :unprocessable_entity }
      end
    end
  end

  private
  def create_entry_import
    @entry_import = Entry::Import.new
  end

  def entry_upload_params
    params.require(:entry_import).permit(:date, :entry_type, :file_upload, :file_url)
  end
end
