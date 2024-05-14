class Entries::PrintController < ApplicationController
  def show
    @filtered_items = Entry::EntryItemSearch.new(
      scope:   EntryItem.joins(:entry).where(entries: {organization_id: @current_org.id}),
      filters: entry_filter_params.dig(:filter).merge(aasm_state: "approved")
    ).results.includes(entry: :journalable, account: :account_object).order("entries.date")

    @entries = @filtered_items.map(&:entry).uniq

    set_filters
    codes = parse_element_w_range(@account_filter["objectCode"])

    if codes.blank?
      @account_objects = @current_org.account_objects.order(:code)
    else
      @account_objects = @current_org.account_objects.where(code: codes).order(:code)
    end

    respond_to do |format|
      format.html { render print_view }
      format.pdf do
        render  pdf:         "entries",
                template:    "entries/print/#{print_view}",
                layout:      "print",
                disposition: "attachment",
                orientation: "Landscape",
                header: { right: "[page] of [topage]" },
                page_size:   "Letter"
      end
      format.xlsx do
        render xlsx: print_view
      end
    end
  end

  private

  def entry_filter_params
    @entry_filter_params = JSON.parse(params[:filter]).keep_if {|k,v| v.present?}.with_indifferent_access
  end

  def print_view
    entry_filter_params.dig(:ui, :ledgerView)
  end

  def set_filters
    @account_filter = @entry_filter_params.dig(:filter)&.dig(:account)
    @start_date = @entry_filter_params.dig(:filter)&.dig(:start_date)&.to_date
    @end_date = @entry_filter_params.dig(:filter)&.dig(:end_date)&.to_date
  end

  def parse_element_w_range(filter_val)
    if filter_val.is_a? String
      filter_val = filter_val.split(',').map(&:strip)
      filter_val = filter_val.map { |val| val =~ /\.\.\.|-/ ? Range.new(*val.split(/\.\.\.|-/).map(&:to_i)).map(&:to_s) : val}
      filter_val.flatten!
      filter_val.uniq!
    end
    filter_val
  end
end
