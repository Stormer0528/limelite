import PropTypes from "prop-types";
import clsx from "clsx";

import Grid from "@material-ui/core/Grid";
import TextField from "./styled_textfield";
import KeyboardDate from "../../../reports/shared/keyboard_date";
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

const QuoteProposalForm = ({
  quoteDate,
  quoteNumber,
  proposalDate,
  proposalNumber,
  disabled = false,
  readOnly = false,
  handleChange = function () {},
  handleBlur = function () {},
  handleDate = function () {},
  classes = {},
}) => {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container spacing={1} className={classes.sectionRow}>
        <Grid item sm={4} md={2} className={classes.dateControl}>
          <KeyboardDate
            fullWidth
            label="Quote Date"
            value={quoteDate}
            disabled={disabled}
            readOnly={readOnly}
            onChange={handleDate("quoteDate")}
            inputVariant="outlined"
            className={clsx(classes.dateFieldOutline, {
              readOnly,
              disabled,
            })}
            inputProps={{className: classes.basicOutlineInput}}
          />
        </Grid>
        <Grid xs item className={classes.formCell}>
          <TextField
            fullWidth
            id="quoteNumber"
            name="quoteNumber"
            label="Quote Number"
            value={quoteNumber}
            disabled={disabled}
            InputProps={{readOnly}}
            onChange={handleChange}
            onBlur={handleBlur}
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        {/* Proposal Section */}
        <Grid item sm={4} md={2} className={classes.dateControl}>
          <KeyboardDate
            fullWidth
            label="Proposal Date"
            value={proposalDate}
            disabled={disabled}
            readOnly={readOnly}
            onChange={handleDate("proposalDate")}
            inputVariant="outlined"
            inputProps={{className: classes.basicOutlineInput}}
            className={clsx(classes.dateFieldOutline, {
              readOnly,
              disabled,
            })}
          />
        </Grid>
        <Grid item xs className={classes.formCell}>
          <TextField
            fullWidth
            id="proposalNumber"
            name="proposalNumber"
            label="Proposal Number"
            value={proposalNumber}
            disabled={disabled}
            InputProps={{readOnly}}
            onChange={handleChange}
            onBlur={handleBlur}
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
      </Grid>
    </MuiPickersUtilsProvider>
  );
};

QuoteProposalForm.propTypes = {
  quoteDate: PropTypes.string,
  quoteNumber: PropTypes.string,
  proposalDate: PropTypes.string,
  proposalNumber: PropTypes.string,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  handleChange: PropTypes.func,
  handleBlur: PropTypes.func,
  handleDate: PropTypes.func,
  classes: PropTypes.object.isRequired,
};

export default QuoteProposalForm;
