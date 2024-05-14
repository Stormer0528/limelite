import {useState} from "react";
import clsx from "clsx";
import {makeStyles} from "@material-ui/core/styles";
import {useParams} from "react-router-dom";
import {useQuery, useMutation} from "@apollo/react-hooks";
import {Formik} from "formik";
import {useSnackbar} from "notistack";

import LOAD_QUERY from "@graphql/queries/load_batch_upload.gql";
import FILESTACK_PERMISSIONS_QUERY from "@graphql/queries/file_stack_permissions.gql";
import BATCH_UPLOAD_MUTATION from "@graphql/mutations/create_batch_upload_invoice.gql";
import VENDOR_QUERY from "@graphql/queries/vendors.gql";

import Breadcrumb from "../breadcrumb";
import ApprovalFooter from "./approval_footer";
import Paper from "@material-ui/core/Paper";

import Table from "./table";
import Preview from "./preview";

import ThumbsUpDownIcon from "@material-ui/icons/ThumbsUpDown";

export default function EditView() {
  const classes = useStyles();
  const {account_id} = useParams();
  const {
    loading,
    data: {batchUpload, batchUpload: {id, files = []} = {}} = {},
  } = useQuery(LOAD_QUERY, {
    variables: {
      id: account_id,
    },
  });

  const [createBatchUpload] = useMutation(BATCH_UPLOAD_MUTATION);
  const {
    loading: filestackLoading,
    refetch,
    data: {filestack: {security: {signature, policy} = {}} = {}} = {},
  } = useQuery(FILESTACK_PERMISSIONS_QUERY, {
    fetchPolicy: "network-only",
    pollInterval: 1000 * 60 * 4, // Refresh every 4 mins
  });

  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const handleRowClick = (index) => () => {
    setCurrentFileIndex(index);
  };

  const {data: {vendors = []} = {}} = useQuery(VENDOR_QUERY, {
    partialRefetch: true,
  });
  const {enqueueSnackbar} = useSnackbar();

  if (loading || filestackLoading) {
    return null;
  }

  const onSubmit = () => {};

  return (
    <Formik initialValues={{files}} onSubmit={onSubmit}>
      {({values, handleChange}) => {
        const handleApproveClick = (index) => async () => {
          const file = values.files[index];
          delete file.__typename;
          delete file.reason;
          file.accounts.forEach((acc) => {
            delete acc.__typename;
            delete acc.accountName;
          });

          const {data: {createInvoiceFromBatchFile} = {}} =
            await createBatchUpload({
              variables: {id, file},
            });

          const {success, errorMessages, invoice} = createInvoiceFromBatchFile;
          const {path} = invoice || {};

          if (!success && errorMessages.length > 0) {
            errorMessages.forEach((message) =>
              enqueueSnackbar(message, {
                variant: "error",
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "center",
                },
              })
            );
          }

          if (success && path) {
            handleChange({
              target: {
                name: `files[${index}].path`,
                value: path,
              },
            });
          }
        };

        return (
          <section className={clsx("react-inputs", classes.root)}>
            <Breadcrumb />

            <h3 className={classes.header}>
              <ThumbsUpDownIcon color="primary" fontSize="inherit" />
              Approve Vendor Invoices
            </h3>

            <Paper className={classes.previewRoot}>
              <div className={classes.table}>
                <Table
                  files={values.files}
                  id={id}
                  currentFileIndex={currentFileIndex}
                  handleRowClick={handleRowClick}
                  handleChange={handleChange}
                  handleApproveClick={handleApproveClick}
                />
              </div>
              <div className={classes.preview}>
                <Preview
                  file={values.files[currentFileIndex]}
                  name={`files[${currentFileIndex}]`}
                  {...{signature, policy, handleChange, vendors, refetch}}
                />
              </div>
            </Paper>
            <ApprovalFooter {...batchUpload} />
          </section>
        );
      }}
    </Formik>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "50vh",
  },
  header: {
    display: "flex",
    marginTop: theme.spacing(),

    "& > svg": {
      marginRight: ".35em",
    },
  },
  previewRoot: {
    display: "grid",
    gridTemplateColumns: "minmax(250px, 350px) 1fr",
    height: "calc(100vh - 122px)",
    columnGap: "1rem",
    padding: theme.spacing(),
    marginBottom: "15vh",
  },
  table: {
    borderRight: "1px solid #c0c0c0",
    margin: "-8px 0 -8px -8px",
    padding: 8,
    background: "#fafafa",
    overflowY: "auto",
  },
  preview: {
    overflowY: "auto",
  },
}));
