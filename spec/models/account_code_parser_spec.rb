require "rails_helper"

RSpec.describe AccountCodeParser, type: :model do
  context "Getters for each element" do
    it { should respond_to :fund_code }
    it { should respond_to :function_code }
    it { should respond_to :goal_code }
    it { should respond_to :location_code }
    it { should respond_to :object_code }
    it { should respond_to :resource_code }
    it { should respond_to :year_code }
  end

  context "Setters for each element" do
    it { should respond_to :fund_code= }
    it { should respond_to :function_code= }
    it { should respond_to :goal_code= }
    it { should respond_to :location_code= }
    it { should respond_to :object_code= }
    it { should respond_to :resource_code= }
    it { should respond_to :year_code= }
  end

  context "#max_length" do
    it "should set defaut max_length to 4" do
      expect(AccountCodeParser.max_length :some_code).to eq(4)
    end

    it "should set year_code length to 1" do
      expect(AccountCodeParser.max_length :year).to eq(1)
    end

    it "should set location_code length to 2" do
      expect(AccountCodeParser.max_length :location).to eq(2)
    end
  end

  it "#empty?" do
    expect(subject).to respond_to :empty?
    expect(subject).to be_empty

    subject.fund_code = "1234"
    expect(subject).not_to be_empty
  end

  context "Import/Export" do
    it "#to_h" do
      expect(subject).to respond_to :to_h
      expect(subject.to_h).to be_a(Hash)
      subject.fund_code = "1234"
      subject.resource_code = "11"
      subject.object_code = "9500-9599"
      subject.goal_code = " "

      # Cast/Translate elements
      expect(subject.to_h).to eq(fund_code: "1234", resource_code: 1100..1199, object_code: 9500..9599)

      # Skip keys for empty elements
      expect(subject.to_h.keys).to_not include(:function_code, :goal_code, :location_code, :year_code)
    end

    xit "#to_json" do
      expect(subject).to respond_to :to_json
      skip
    end

    xit "#from_json" do
      expect(subject).to respond_to :from_json
      skip
    end
  end

  context "Parsing:" do
    context "cleaning/setting values" do
      it "should set all of the codes" do
        attrs = {fund_code: "1111", function_code: "1111", goal_code: "1111", location_code: "11", object_code: "1111", resource_code: "1111", year_code: "1"}
        model = AccountCodeParser.new attrs

        expect(model).to have_attributes(attrs)
      end

      context "should handle nil/blank values" do
        it "should ignore empty strings" do
          subject.fund_code = ""
          expect(subject.fund_code).to be_nil
        end

        it "should ignore strings of only whitespace" do
          subject.fund_code = "                        "
          expect(subject.fund_code).to be_nil
        end
      end
    end

    context "#parse" do
      it "should run the passed block on a single value" do
        expect {|b| subject.parse("1234", &b) }.to yield_control.exactly(1).times
      end

      it "should run the passed block on every item of an array" do
        expect {|b| subject.parse(["1", "2", "3"], &b) }.to yield_successive_args("1", "2", "3")
      end
    end

    context "#parse_list" do
      it "should parse a comma separated list into string values" do
        parsed_list = subject.parse_list "1,2,3,4"
        expect(parsed_list.sort).to eq(["1", "2", "3", "4"])
      end

      it "should return the passed value if there are no commas in the string" do
        expect(subject.parse_list("1234")).to eq "1234"
      end

      it "should return Integers and Ranges without modification when passed" do
        expect(subject.parse_list(1234)).to eq 1234
        expect(subject.parse_list(1000..1234)).to eq(1000..1234)
      end

      it "should return a single array of strings if passed an array of lists" do
        parsed_list = subject.parse_list ["1,2,3", "4", "5,6"]
        expect(parsed_list.sort).to eq(["1", "2", "3", "4", "5", "6"])
      end

      it "should remove whitespace from list items" do
        expect(subject.parse_list "123 , 456  ").to eq(["123", "456"])
      end
    end

    context "#parse_range" do
      subject { AccountCodeParser.new fund_code: "8000...8099", function_code: "9000..9999", goal_code: "1000-1231" }

      it "should parse ... into a range" do
        expect(subject.fund_code).to be_a(Range)
        expect(subject.fund_code).to cover(8000, 8099)
      end

      it "should parse .. into a range" do
        expect(subject.function_code).to be_a(Range)
        expect(subject.function_code).to cover(9000, 9999)
      end

      it "should - into a range" do
        expect(subject.goal_code).to be_a(Range)
        expect(subject.goal_code).to cover(1000, 1231)
      end

      it "should parse a list of ranges" do
        @range_list = AccountCodeParser.new fund_code: "1231...1234,1234...1790"

        expect(@range_list.fund_code[0]).to be_a(Range)
        expect(@range_list.fund_code[0]).to eq(1231..1234)

        expect(@range_list.fund_code[1]).to be_a(Range)
        expect(@range_list.fund_code[1]).to eq(1234..1790)
      end
    end
  end

  # TODO: put tests with object casting
  context "should parse values when set" do
    subject { AccountCodeParser.new fund_code: "1234, 4526 " }

    it "should parse comma separated values into an array" do
      expect(subject.fund_code).to be_a(Array)
      expect(subject.fund_code).to eq(["1234", "4526"])
    end

    it "should strip spaces from value" do
      expect(subject.fund_code[1]).to eq("4526")
      expect(subject.fund_code[1]).not_to eq(" 4526 ")
    end
  end

  context "Parse Partial Values:" do
    subject {
      AccountCodeParser.new \
        fund_code:     "95",
        function_code: "8999",
        goal_code:     "929",
        object_code:   "1234",
        resource_code: "1112",
        location_code: "2",
        year_code:     "9"
    }

    it "should parse partial values into a range with the correct max_length" do
      expect(subject.fund_code).to eq(9500..9599)
      expect(subject.goal_code).to eq(9290..9299)
      expect(subject.fund_code).to eq(9500..9599)
    end

    it "should not parse values already at max_length" do
      expect(subject.function_code).to eq("8999")
      expect(subject.object_code).to eq("1234")
      expect(subject.resource_code).to eq("1112")
    end

    it "should fill location_code to 2 values" do
      expect(subject.location_code).to eq(20..29)
    end

    it "should fill year_code to 1 value" do
      expect(subject.year_code).to eq("9")
    end
  end

  context "Kitchen Sink:" do
    subject {
      AccountCodeParser.new \
        fund_code:     "95, 1234, 1700..2500",
        function_code: "8999",
        goal_code:     "929",
        object_code:   "1000...1500",
        resource_code: "    1112    ,    1113...1200  ,  24 ",
        location_code: "2",
        year_code:     ""
    }

    it "handles a list with a partial code, full code and range" do
      expect(subject.fund_code).to be_a(Array)
      expect(subject.fund_code[0]).to be_a(Range)
      expect(subject.fund_code[0]).to eq(9500..9599)
      expect(subject.fund_code[1]).to eq("1234")
      expect(subject.fund_code[2]).to be_a(Range)
      expect(subject.fund_code[2]).to cover(1700, 2500)
    end

    it "returns a simple value as a string" do
      expect(subject.function_code).to eq("8999")
    end

    it "returns a simple value as a string" do
      expect(subject.goal_code).to cover(9290, 9299)
    end

    it "returns a simple range value" do
      expect(subject.object_code).to eq(1000..1500)
    end

    it "strips spaces from string, range and partial values" do
      expect(subject.resource_code).to be_a(Array)

      expect(subject.resource_code[0]).to be_a(String)
      expect(subject.resource_code[0]).to eq("1112")

      expect(subject.resource_code[1]).to be_a(Range)
      expect(subject.resource_code[1]).to eq(1113..1200)

      expect(subject.resource_code[2]).to be_a(Range)
      expect(subject.resource_code[2]).to cover(2400, 2499)
    end
  end

  context "Validations:" do
    skip
    xcontext "should validate the max_length of each code type" do
      it { should validate_length_of(:fund_code).is_equal_to(4) }
      it { should validate_length_of(:function_code).is_equal_to(4) }
      it { should validate_length_of(:goal_code).is_equal_to(4) }
      it { should validate_length_of(:location_code).is_equal_to(2) }
      it { should validate_length_of(:object_code).is_equal_to(4) }
      it { should validate_length_of(:resource_code).is_equal_to(4) }
      it { should validate_length_of(:year_code).is_equal_to(1) }
    end

    it "should validate code is not alphabetical"
    it "should validate ranges and lists differently"
  end
end
