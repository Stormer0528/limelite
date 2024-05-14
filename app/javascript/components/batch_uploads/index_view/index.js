/* eslint-disable react/display-name */
import PropTypes from "prop-types";
import {Formik} from "formik";
import View from "./view";
import LOAD_UPLOADS_QUERY from "@graphql/queries/batch_uploads.gql";
import {useQuery} from "@apollo/react-hooks";

function IndexView() {
  return (
    <Formik
      initialValues={{
        aasmState: ["needs_approval"],
      }}
    >
      {({values: {aasmState, ...restVars} = {}}) => {
        const {
          refetch,
          data: {batchUploads = []} = {},
          loading,
        } = useQuery(LOAD_UPLOADS_QUERY, {
          variables: {
            aasmState: aasmState.join(","),
            ...restVars,
          },
          fetchPolicy: "network-only",
        });

        if (loading) {
          return null;
        }
        return <View refetch={refetch} batchUploads={batchUploads} />;
      }}
    </Formik>
  );
}

IndexView.propTypes = {
  classes: PropTypes.object,
};

export default IndexView;
