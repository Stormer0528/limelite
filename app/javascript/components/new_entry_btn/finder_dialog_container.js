import PropTypes from "prop-types";
import {Formik} from "formik";
import {defaultEntryState} from "../entries/form/use_entry_form";
import {useSnackbar} from "notistack";

import FinderDialog from "./finder_dialog";
import API from "../entries/form/api";

import Button from "@material-ui/core/Button";
import {RecoilRoot} from "recoil";

const FinderDialogContainer = (props) => {
  const {enqueueSnackbar} = useSnackbar();
  const {toggleModalOpen = function () {}} = props;

  const handleCloseDialog = () => {
    toggleModalOpen(false);
  };

  const handleCancelClick = (resetForm) => () => {
    resetForm();
    toggleModalOpen(false);
  };

  const handleSubmit = async (values, actions) => {
    actions.setSubmitting(true);

    const entry = await API.createEntry(values.entry);
    actions.setSubmitting(false);

    if (entry.errors.length > 0) {
      actions.setErrors({entry: entry.errors});
    } else {
      handleCloseDialog();
      actions.resetForm();
      enqueueSnackbar("Entry Saved", {
        variant: "success",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        action: () => (
          <Button style={{color: "#fffc"}} href={entry.path}>
            View Entry
          </Button>
        ),
      });
    }

    return entry.errors.length === 0;
  };

  const handleSubmitClick = ({submitForm}) => async () => {
    submitForm();
  };

  return (
    <RecoilRoot>
      <Formik
        initialValues={{
          entry: {...defaultEntryState},
        }}
        validate={false}
        validateOnChange={false}
        onSubmit={handleSubmit}
      >
        {({submitForm, resetForm}) => {
          return (
            <FinderDialog
              {...{
                handleCancelClick: handleCancelClick(resetForm),
                handleCloseDialog,
                handleSubmitClick: handleSubmitClick({submitForm}),
                ...props,
              }}
            />
          );
        }}
      </Formik>
    </RecoilRoot>
  );
};

FinderDialogContainer.propTypes = {
  toggleModalOpen: PropTypes.func.isRequired,
};

export default FinderDialogContainer;
