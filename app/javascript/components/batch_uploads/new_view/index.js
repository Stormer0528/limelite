import {useState, Fragment} from "react";
import {useQuery} from "@apollo/react-hooks";
import FILESTACK_PERMISSIONS_QUERY from "@graphql/queries/file_stack_permissions.gql";
import BatchUploadStepper from "./stepper";
import Breadcrumb from "../breadcrumb";
function BatchUploadIndex() {
  const [currentStep, setCurrentStep] = useState(0);
  const [batchFiles, setBatchFiles] = useState({
    filesUploaded: [],
    filesFailed: [],
  });

  const {
    loading,
    refetch: filestackRefetch,
    data: {filestack: {security: {signature, policy} = {}} = {}} = {},
  } = useQuery(FILESTACK_PERMISSIONS_QUERY, {
    fetchPolicy: "network-only",
    pollInterval: 1000 * 60 * 4, // Refresh every 4 mins
  });

  if (loading) {
    return null;
  }

  return (
    <Fragment>
      <Breadcrumb />
      <BatchUploadStepper
        {...{
          currentStep,
          setCurrentStep,
          batchFiles,
          setBatchFiles,
          signature,
          policy,
          filestackRefetch,
        }}
      />
    </Fragment>
  );
}

export default BatchUploadIndex;
