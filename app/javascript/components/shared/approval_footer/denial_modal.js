import {TextField} from "formik-material-ui";
import PropTypes from "prop-types";
import {Formik, Form, Field} from "formik";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import InputAdornment from "@material-ui/core/InputAdornment";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";

const DenialModal = ({open, nextState, handleClose, handleSave}) => {
  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      onClose={handleClose}
      aria-labelledby="denial-modal-title"
      open={open}
    >
      <DialogTitle id="denial-modal-title">Denial Reason</DialogTitle>
      <Formik
        onSubmit={async (values, {setSubmitting}) => {
          setSubmitting(true);
          await handleSave(values);

          setSubmitting(false);
          handleClose();
        }}
        initialValues={{reason: "", nextState}}
      >
        {({submitForm, isSubmitting}) => {
          return (
            <DialogContent>
              <Form className="react-inputs">
                <Field
                  component={TextField}
                  autoFocus
                  multiline
                  fullWidth
                  label=""
                  name="reason"
                  variant="outlined"
                />
                <DialogActions>
                  <Button onClick={handleClose} disabled={isSubmitting}>
                    Cancel
                  </Button>
                  <Button
                    startIcon={
                      <InputAdornment>
                        <SaveIcon />
                      </InputAdornment>
                    }
                    disabled={isSubmitting}
                    onClick={submitForm}
                    color="primary"
                    autoFocus
                  >
                    Submit
                  </Button>
                </DialogActions>
              </Form>
            </DialogContent>
          );
        }}
      </Formik>
    </Dialog>
  );
};
DenialModal.propTypes = {
  open: PropTypes.bool,
  nextState: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
};

export default DenialModal;
