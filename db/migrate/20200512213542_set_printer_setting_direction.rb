class SetPrinterSettingDirection < ActiveRecord::Migration[5.1]
  def change
    PrinterSetting.all {|setting| setting.update(direction: "ASC")}
  end
end
