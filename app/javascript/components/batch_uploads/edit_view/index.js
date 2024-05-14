import {useState, Fragment} from "react";
import {useQuery} from "@apollo/react-hooks";
import {useParams} from "react-router-dom";

import StepTwo from "./step_two";
import Breadcrumb from "../breadcrumb";

import LOAD_QUERY from "@graphql/queries/load_batch_upload_edit.gql";
import FILESTACK_PERMISSIONS_QUERY from "@graphql/queries/file_stack_permissions.gql";

function BatchUploadIndex() {
  const {account_id} = useParams();
  const [batchFiles, setBatchFiles] = useState({
    filesUploaded: [],
    filesFailed: [],
  });

  const {
    refetch: refetchFilestack,
    loading: permissionsLoading,
    data: {filestack: {security: {signature, policy} = {}} = {}} = {},
  } = useQuery(FILESTACK_PERMISSIONS_QUERY, {
    fetchPolicy: "network-only",
    pollInterval: 1000 * 60 * 4, // Refresh every 4 mins
  });

  const {
    loading: uploadLoading,
    data: {batchUpload = {}, batchUpload: {aasmState, files = []} = {}} = {},
  } = useQuery(LOAD_QUERY, {
    variables: {
      id: account_id,
    },
    onCompleted: ({batchUpload: {files = []} = {}}) => {
      setBatchFiles({filesUploaded: files, filesFailed: []});
    },
  });

  const loading = permissionsLoading || uploadLoading || files.length === 0;

  if (loading) {
    return null;
  }

  return (
    <Fragment>
      <Breadcrumb />
      <StepTwo
        aasmState={aasmState}
        batchFiles={batchFiles}
        batchUpload={batchUpload}
        signature={signature}
        policy={policy}
        id={account_id}
        refetchFilestack={refetchFilestack}
      />
    </Fragment>
  );
}

export default BatchUploadIndex;
