# Encapsulates logic for creating a fiscal year
# TODO: Test with DateTime objects
# TODO: Create tesing files

class FiscalYear
  include ActiveModel::Model
  attr_accessor :year, :id

  def initialize(year=Date.today.year)
    super({year: year, id: year})
  end

  def beginning_of_year
    Date.parse("#{@year}/07/01")
  end

  def end_of_year
     Date.parse("#{@year + 1}/06/30")
  end

  def contains(date)
    date.to_date < end_of_year && date.to_date > beginning_of_year
  end

  def to_s
    year.to_s
  end

  def to_i
    year.to_i
  end

  # CLASS METHODS
  #-----------------------------------------------------------
  def self.get_year(date=Date.today)
    return new(date) if date.is_a? Integer

    date = Date.parse(date) if date.is_a? String

    if date >= Date.parse("#{date.year}/07/01")
      new(date.year)
    else
      new(date.year - 1)
    end
  end

  def self.current_fiscal_year
    self.get_year
  end
end
