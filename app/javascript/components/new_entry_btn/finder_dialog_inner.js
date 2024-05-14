import PropTypes from "prop-types";
import clsx from "clsx";

// Material UI
import DialogContent from "@material-ui/core/DialogContent";
import {withStyles} from "@material-ui/core/styles";

// Components
import EntryForm from "../entries/form/entry_form";

const FinderDialogInner = ({
  handleChange,
  handleBlur,
  setFieldValue,
  classes = {},
}) => {
  return (
    <DialogContent className={clsx("react-inputs", classes.dialogContent)}>
      <EntryForm
        {...{
          hideFormHeader: true,
          handleChange,
          handleBlur,
          setFieldValue,
        }}
      />
    </DialogContent>
  );
};

FinderDialogInner.propTypes = {
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
  dialogSm: {
    maxWidth: "95%",
  },
  dialogTitle: {
    padding: "0 1.5rem 0",
  },
  dialogContent: {
    padding: `0 ${2 * theme.spacing(1)}px 0`,
  },
  pageHeader: {
    padding: "1em",
  },
});

export default withStyles(styles)(FinderDialogInner);
