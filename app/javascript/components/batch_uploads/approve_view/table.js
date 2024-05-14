import {Fragment, useCallback} from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import {makeStyles} from "@material-ui/core/styles";

import {Field} from "formik";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import TextField from "@material-ui/core/TextField";
import {TextField as FormikTextField} from "formik-material-ui";
import RejectBtn from "./reject_btn";
import ApproveIcon from "@material-ui/icons/ThumbUp";
import DeleteIcon from "@material-ui/icons/Delete";
import LaunchIcon from "@material-ui/icons/Launch";

import currency from "currency.js";
import {useMutation} from "@apollo/react-hooks";
import DELETE_BATCH_UPLOAD_FILE from "@graphql/mutations/delete_batch_upload_file";
import DENY_BATCH_UPLOAD_FILE from "@graphql/mutations/reject_batch_upload_file";

function Table({
  id,
  files = [],
  currentFileIndex = 0,
  handleRowClick = () => () => {},
  handleApproveClick = () => () => {},
}) {
  const classes = useStyles();
  const [deleteFile] = useMutation(DELETE_BATCH_UPLOAD_FILE, {
    onCompleted: ({deleteBatchUploadFile: {success, errors = []}}) => {
      if (success) {
        window.location.reload();
      } else {
        console.error(errors);
      }
    },
  });
  const [denyFile] = useMutation(DENY_BATCH_UPLOAD_FILE, {
    onCompleted: ({denyBatchUploadFile: {success, errors = []} = {}}) => {
      if (success) {
        window.location.reload();
      } else {
        console.error(errors);
      }
    },
  });

  const handleDeleteClick = useCallback(
    (index) => (e) => {
      e.preventDefault();
      const shouldContinue = confirm(
        "Are you sure you want to delete Batch Upload?"
      );
      if (shouldContinue) {
        deleteFile({
          variables: {id, fileIndex: index},
        });
      }
    },
    [deleteFile, id]
  );

  const handleDenyClick = useCallback(
    ({index, reason}) => {
      denyFile({
        variables: {id, fileIndex: index, reason},
      });
    },
    [denyFile, id]
  );

  return (
    <Fragment>
      <h4 className={classes.uploadHeader}>VENDOR INVOICE UPLOADS</h4>

      {files.map((file, i) => {
        const isReadOnly = Boolean(file.path) || file.approved === false;
        const isFileRejected = file.approved === false;
        const isFileApproved = file.approved === true || Boolean(file.path);
        const fileTotal = file.accounts.reduce((total, account) => {
          const {amount = 0} = account || {};
          return currency(total).add(amount);
        }, 0);

        return (
          <Card
            key={i}
            onClick={handleRowClick(i)}
            onFocus={handleRowClick(i)}
            className={clsx(classes.Card, {
              [classes.currentRow]: currentFileIndex === i,
              [classes.disabled]: isReadOnly || isFileRejected,
              [classes.rejected]: isFileRejected,
            })}
          >
            <div className={classes.container}>
              <Field
                fullWidth
                component={FormikTextField}
                label="Invoice #"
                margin="dense"
                variant="outlined"
                className={classes.textField}
                readOnly={isReadOnly}
                name={`files[${i}].invoiceNumber`}
                disabled
                inputProps={{
                  readOnly: isReadOnly,
                  className: "browser-default",
                }}
              />

              <TextField
                fullWidth
                label="Amount"
                margin="dense"
                readOnly
                variant="outlined"
                className={classes.amountTextField}
                disabled
                value={fileTotal.format()}
              />
            </div>
            {isFileRejected && (
              <TextField
                fullWidth
                multiline
                label="Rejection Reason"
                margin="dense"
                readOnly
                variant="outlined"
                className={classes.amountTextField}
                disabled
                value={file.reason}
              />
            )}
            <CardActions
              className={clsx(classes.btnContainer, {
                [classes.btnContainerCompleted]: isReadOnly,
              })}
            >
              {!isReadOnly && (
                <Fragment>
                  <Button
                    fullWidth
                    disabled={isReadOnly && file.invoiceNumber}
                    onClick={handleApproveClick(i)}
                    className={classes.approveBtn}
                    startIcon={<ApproveIcon />}
                  >
                    Approve
                  </Button>
                  <RejectBtn
                    {...{
                      isReadOnly,
                      file,
                      classes,
                      index: i,
                      onSave: handleDenyClick,
                    }}
                  />
                  <span />
                  <Button
                    disabled={isReadOnly && file.invoiceNumber}
                    onClick={handleDeleteClick(i)}
                    className={classes.deleteBtn}
                  >
                    <DeleteIcon />
                  </Button>
                </Fragment>
              )}

              {isReadOnly && file.path && (
                <Button
                  href={file.path}
                  target="_blank"
                  endIcon={<LaunchIcon />}
                >
                  View Invoice
                </Button>
              )}
              {isReadOnly && isFileRejected && (
                <Fragment>
                  <Button href={""} className={classes.revisionBtn} disabled>
                    Needs Revision
                  </Button>
                  <span />
                  <Button
                    disabled={isReadOnly && file.invoiceNumber}
                    onClick={handleDeleteClick(i)}
                    className={classes.deleteBtn}
                  >
                    <DeleteIcon />
                  </Button>
                </Fragment>
              )}
            </CardActions>
          </Card>
        );
      })}
    </Fragment>
  );
}

Table.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  files: PropTypes.array,
  currentFileIndex: PropTypes.number,
  handleRowClick: PropTypes.func,
  handleChange: PropTypes.func,
  handleApproveClick: PropTypes.func,
};

const useStyles = makeStyles(({approvalBtns: {approveBtn, denyBtn}}) => {
  return {
    container: {
      display: "grid",
      gridTemplateColumns: "1.5fr 1fr",
      gridColumnGap: 8,
    },

    btnContainer: {
      display: "grid",
      padding: "8px 0",
      gridTemplateColumns: "repeat(2, minmax(min-content, 10rem)) 1fr 5.5em",
      gridColumnGap: 8,
    },
    btnContainerCompleted: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    textField: {
      "& input": {
        padding: "10.5px 14px",
        background: "#fff",
      },

      "& input:focus": {
        padding: "10.5px 14px",
        background: "#fff",
      },
    },
    amountTextField: {
      "& > div": {
        padding: "10.5px 14px",
        backgroundColor: "#fff",
      },

      ".react-inputs & input": {
        padding: "0 !important",
        color: "#333",
        textAlign: "right",
      },

      ".react-inputs & input:disabled": {
        color: "#333",
      },

      ".react-inputs & input:readonly": {
        color: "#333",
      },

      ".react-inputs & input:focus": {
        padding: "0 !important",
        color: "#333",
      },
    },

    uploadHeader: {
      color: "#bdbdbd",
      margin: "0 .5rem",
      fontSize: 12,
      fontWeight: "bold",
    },

    revisionBtn: {
      flexGrow: 1,
    },

    /* Cards */
    Card: {
      margin: 8,
      padding: 8,
      borderRadius: 4,
    },

    disabled: {backgroundColor: "#f5f5f5"},
    currentRow: {
      background: "linear-gradient(to top, #e1f5fe, #e1f5fe7d)",
      border: "3px solid #0277bd",
    },

    /* Btns */
    approveBtn: {
      ...approveBtn,
      "& svg": {
        position: "relative",
        top: "-3px",
        fontSize: 20,
        transform: "rotateY(180deg)",
      },
    },
    denyBtn: {
      ...denyBtn,
      "& svg": {
        position: "relative",
        top: "-1.75px",
        transform: "rotateY(180deg)",
      },
    },
    deleteBtn: {
      backgroundColor: "#B71C1C",
      color: "white",
      opacity: 0.5,

      "&:hover": {
        backgroundColor: "#B71C1C",
        opacity: 1,
      },

      "&:focus": {
        backgroundColor: "#B71C1C",
        opacity: 1,
      },
    },
  };
});

export default Table;
