import PropTypes from "prop-types";
import {/*withStyles,*/ MuiThemeProvider} from "@material-ui/core/styles";
import {siteTheme as theme} from "../../utils";

import HiddenInputs from "./hidden_inputs_container";
import {withFormik} from "formik";
import {defaultEntryState} from "../entries/form/use_entry_form";
import {EntryFormProvider} from "../entries/form/entry_form_context";

import Form from "./form";
import {RecoilRoot} from "recoil";

const EntryInput = ({
  parent_class,
  addItemLabel,
  amountType = "both",
  summaryRowFund,
  handleChange,
  handleBlur,
  setFieldValue,
}) => {
  return (
    <MuiThemeProvider theme={theme}>
      <RecoilRoot>
        <EntryFormProvider>
          <section className="EntryInputSection">
            <Form
              {...{
                addItemLabel,
                handleChange,
                handleBlur,
                setFieldValue,
              }}
            />
            <HiddenInputs {...{parent_class, summaryRowFund, amountType}} />
          </section>
        </EntryFormProvider>
      </RecoilRoot>
    </MuiThemeProvider>
  );
};

EntryInput.propTypes = {
  loading: PropTypes.bool,
  parent_class: PropTypes.string,
  addItemLabel: PropTypes.string,
  amountType: PropTypes.string,
  summaryRowFund: PropTypes.string,
  invoiceRemaining: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
};

export default withFormik({
  mapPropsToValues: (props) => {
    const {entry, payment} = props.initialState || {};
    return {payment, entry: {...defaultEntryState, ...entry}};
  },
})(EntryInput);
