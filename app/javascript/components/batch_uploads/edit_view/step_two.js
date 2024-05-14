import {Fragment} from "react";
import PropTypes from "prop-types";
import {Formik} from "formik";
import find from "lodash/find";
import {makeStyles} from "@material-ui/core/styles";

import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";

import {useQuery, useMutation} from "@apollo/react-hooks";
import VENDOR_QUERY from "@graphql/queries/vendors.gql";
import BATCH_UPLOAD_MUTATION from "@graphql/mutations/update_batch_upload.gql";

import SubmissionBar from "./submission_bar";
import ItemPreview from "../new_view/item_preview";
import UploadIcon from "@material-ui/icons/CloudUpload";

// import Debug from "@shared/formik_debug";
// import testData from "./test_data";

export default function StepTwo({
  signature,
  policy,
  batchUpload,
  batchFiles = {
    filesUploaded: [],
    filesFailed: [],
  },
  id,
  aasmState = "draft",
  refetchFilestack = function () {},
}) {
  const classes = useStyles();
  const [updateBatchUpload] = useMutation(BATCH_UPLOAD_MUTATION);
  const {data: {vendors = []} = {}} = useQuery(VENDOR_QUERY, {
    partialRefetch: true,
  });

  const onSubmit = async ({filesUploaded: values = []}, {setSubmitting}) => {
    const files = values.map(
      ({
        handle,
        notes,
        uploadId,
        url,
        vendorId,
        vendorName,
        entry: {entryItems = []},
        date,
        dueDate,
        invoiceNumber,
      }) => {
        const accounts = entryItems.map(
          ({accountId, number: accountNumber, amount}) => {
            return {accountId, accountNumber, amount};
          }
        );
        return {
          accounts,
          handle,
          notes,
          uploadId,
          url,
          vendorId,
          vendorName,
          date: reassembleDate(date),
          dueDate: reassembleDate(dueDate),
          invoiceNumber,
        };
      }
    );

    const {error, data: {errors} = {}} = await updateBatchUpload({
      variables: {id, files},
    });

    if (error || errors) {
      // eslint-disable-next-line no-console
      console.error(error, errors);
    }

    setSubmitting(false);

    window.location = "/vendors";
  };

  // const {filesUploaded = []} = testData;
  const {filesUploaded /*filesFailed*/} = batchFiles;
  const initialValues = filesUploaded.map((file) => {
    if (!file.entry) {
      file.entry = {entryItems: []};
    }

    if (file.accounts) {
      file.accounts.forEach(
        ({amount, accountId, accountName, accountNumber = ""}) => {
          const codes = accountNumber ? accountNumber.split("-") : []; // "1118-0000-0-0000-0000-4100-00"
          file.entry.entryItems.push({
            accountId,
            accountName,
            credit: amount,
            amount: amount,
            type: "Credit",
            changed: true,
            fundCode: codes[0],
            resourceCode: codes[1],
            yearCode: codes[2],
            goalCode: codes[3],
            functionCode: codes[4],
            objectCode: codes[5],
            locationCode: codes[6],
          });
        }
      );
      delete file.accounts;
    }

    return file;
  });

  if (initialValues.lenth === 0) {
    return null;
  }

  return (
    <Formik initialValues={{filesUploaded: initialValues}} onSubmit={onSubmit}>
      {({handleSubmit, values, handleChange, setFieldValue}) => {
        const handleAmountChange =
          (name) =>
          ({floatValue}) => {
            handleChange({
              target: {
                name,
                value: floatValue,
              },
            });
          };

        const handleVendorChange = (name) => (e, text) => {
          handleChange({
            target: {
              name: `${name}.vendorName`,
              value: text,
            },
          });

          const selected = find(vendors, (obj) => obj.displayName === text);

          handleChange({
            target: {
              name: `${name}.vendorId`,
              value: selected ? selected.id : undefined,
            },
          });
        };

        const handleAccountFinderUpdate =
          (name) =>
          ({account}) => {
            handleChange({
              target: {
                name: `${name}.accountId`,
                value: account.id,
              },
            });

            handleChange({
              target: {
                name: `${name}.account`,
                value: account,
              },
            });
          };

        if (!values.filesUploaded.length && initialValues.length) {
          setFieldValue("filesUploaded", initialValues);
        }

        return (
          <Fragment>
            <Typography
              gutterBottom
              variant="h5"
              component="h2"
              className={classes.header}
            >
              <Avatar className={classes.avatar} color="primary">
                <UploadIcon />
              </Avatar>
              Batch Upload Vendor Invoices
            </Typography>

            <div className="react-inputs" style={{marginBottom: "75px"}}>
              {values.filesUploaded.map((file, i) => {
                return (
                  <div key={i}>
                    <ItemPreview
                      {...{
                        file,
                        i,
                        policy,
                        signature,
                        vendors,
                        handleChange,
                        handleAmountChange,
                        handleVendorChange,
                        handleAccountFinderUpdate,
                        setFieldValue,
                        refetch: refetchFilestack,
                      }}
                    />
                  </div>
                );
              })}
            </div>
            <SubmissionBar
              {...batchUpload}
              aasmState={aasmState}
              handleSubmit={handleSubmit}
            />
          </Fragment>
        );
      }}
    </Formik>
  );
}

StepTwo.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  aasmState: PropTypes.string,
  signature: PropTypes.string,
  policy: PropTypes.string,
  batchUpload: PropTypes.object,
  batchFiles: PropTypes.shape({
    filesUploaded: PropTypes.array,
    filesFailed: PropTypes.array,
  }),
  refetchFilestack: PropTypes.func.isRequired,
};

const useStyles = makeStyles((theme) => ({
  header: {
    display: "flex",
    alignItems: "center",
  },
  avatar: {
    marginRight: theme.spacing(1),
    backgroundColor: theme.palette.primary.light,
  },
}));

function reassembleDate(d) {
  const [month, day, year] = d.split("/");
  return `${year}-${month}-${day}`;
}
