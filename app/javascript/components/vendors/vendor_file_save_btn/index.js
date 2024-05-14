import {Fragment, useState} from "react";
import PropTypes from "prop-types";

import {useMutation} from "react-apollo";
import SaveBtn from "../../shared/filestack_upload_btn";
import Alert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";

import UPDATE_FILE_URL_MUTATION from "../../../graphql/mutations/update_final_payment_url.gql";

const VendorSaveBtn = props => {
  const [open, setIsOpen] = useState(false);

  const {invoiceId} = props;
  const [saveFileUrl] = useMutation(UPDATE_FILE_URL_MUTATION);

  const handleSaveInvoice = async fileURL => {
    saveFileUrl({
      variables: {
        invoiceID: invoiceId,
        fileURL,
      },
    });
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  async function onFileUploaded({url}) {
    await handleSaveInvoice(url);
    setIsOpen(true);
  }

  return (
    <Fragment>
      <SaveBtn {...props} onFileUploaded={onFileUploaded} />
      <Snackbar
        open={open}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} variant="filled" severity="success">
          Final Payment File Succesfully Uploaded
        </Alert>
      </Snackbar>
    </Fragment>
  );
};

VendorSaveBtn.propTypes = {
  invoiceId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default VendorSaveBtn;
