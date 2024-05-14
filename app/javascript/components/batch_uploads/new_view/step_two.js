import {Fragment} from "react";
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";

import find from "lodash/find";
// import ErrorBoundary from "@shared/error_boundary";

import {useQuery, useMutation} from "@apollo/react-hooks";
import VENDOR_QUERY from "@graphql/queries/vendors.gql";
import BATCH_UPLOAD_MUTATION from "@graphql/mutations/create_batch_upload.gql";

import {Formik} from "formik";

import SubmissionBar from "./submission_bar";
import ItemPreview from "./item_preview";

import ErrorMessageList from "@shared/error_message_list";
// import Debug from "@shared/formik_debug";
// import testData from "./test_data";

export default function StepTwo({
  signature,
  policy,
  batchFiles = {
    filesUploaded: [],
    filesFailed: [],
  },
  refetch = function () {},
}) {
  const classes = useStyles();
  const [createBatchUpload] = useMutation(BATCH_UPLOAD_MUTATION);
  const {data: {vendors = []} = {}} = useQuery(VENDOR_QUERY, {
    partialRefetch: true,
  });

  const onSubmit = async (
    {filesUploaded: values = []},
    {setSubmitting, setFieldError}
  ) => {
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

    const {
      error,
      data: {createBatchInvoiceUpload: {errorMessages: errors} = {}} = {},
    } = await createBatchUpload({
      variables: {files},
    });

    if (error || (Array.isArray(errors) && errors.length)) {
      // eslint-disable-next-line no-console
      console.error(error, errors);
      setFieldError(
        "filesUploaded",
        errors.map((err, i) => <LinkedErrorMessage key={i} error={err} />)
      );

      window.scrollTo(0, 0, {behavior: "smooth"});
    } else {
      window.location = "/vendors";
    }

    setSubmitting(false);
  };

  // const {filesUploaded = []} = testData;

  const {filesUploaded /*filesFailed*/} = batchFiles;
  const initialValues = filesUploaded.map((file) => {
    const defaultValues = {
      date: null,
      dueDate: null,
      entry: {entryItems: [{amount: 0}]},
    };

    return {...defaultValues, ...file};
  });
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

        const handleDateChange = (name) => (_jsDate, formattedDate) => {
          handleChange({
            target: {
              name,
              value: formattedDate,
            },
          });
        };

        return (
          <Fragment>
            <ErrorMessageList />
            <div className="react-inputs" style={{marginBottom: "75px"}}>
              {values.filesUploaded.map((file, i) => {
                return (
                  <div key={i} id={`batch-upload-${i + 1}`}>
                    <h3 className={classes.previewHeader}>Invoice {i + 1}</h3>
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
                        handleDateChange,
                        handleAccountFinderUpdate,
                        setFieldValue,
                        refetch,
                      }}
                    />
                  </div>
                );
              })}
            </div>
            <SubmissionBar handleSubmit={handleSubmit} />
          </Fragment>
        );
      }}
    </Formik>
  );
}

StepTwo.propTypes = {
  signature: PropTypes.string,
  policy: PropTypes.string,
  refetch: PropTypes.func.isRequired,
  batchFiles: PropTypes.shape({
    filesUploaded: PropTypes.array,
    filesFailed: PropTypes.array,
  }),
};

const useStyles = makeStyles(() => ({
  previewHeader: {
    fontSize: 32,
    margin: "36px 0 8px",
    fontWeight: 300,
    color: "#666",
    lineHeight: 1.25,
  },
  link: {
    color: "darkred",
    fontWeight: 800,
  },
}));

// HELPERS
//--------------------------------------------------------------------------
function LinkedErrorMessage({error}) {
  const classes = useStyles();
  const match = error.match(/Batch Upload (\d*) (.*)/);
  if (match) {
    const [, num, msg] = match;
    return (
      <span>
        <a
          className={classes.link}
          href={`#batch-upload-${num}`}
          data-target={`batch-upload-${num}`}
          onClick={({
            target: {
              dataset: {target: elemId},
            },
          }) => {
            const elem = document.querySelector(`#${elemId} h3`);
            elem.scrollIntoView({behavior: "smooth"});
          }}
        >
          Batch Upload {num}
        </a>
        &nbsp;
        {msg}
      </span>
    );
  }

  return error;
}

function reassembleDate(d) {
  const [month, day, year] = d.split("/");
  return `${year}-${month}-${day}`;
}
