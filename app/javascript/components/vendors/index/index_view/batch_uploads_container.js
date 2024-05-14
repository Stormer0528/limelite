import {connect} from "react-redux";
import {compose} from "redux";
import {graphql} from "react-apollo";
import isEqual from "lodash/isEqual";
import LOAD_UPLOADS_QUERY from "../../../../graphql/queries/batch_uploads.gql";

// Components
//------------------------------------------------------------------------------
import BatchUploadsTable from "../../batch_uploads/batch_uploads_table";

const mapStateToProps = (state, props) => {
  const {
    filter = {},
    BatchUploadsQuery: {
      batchUploads = [],
      loading,

      refetch = function() {},
      variables: {cursor, first, ...restVars} = {},
    } = {},
  } = props;

  const filterVars = { ...filter, aasmState: filter.aasmState || undefined }
  if (!isEqual(filterVars, restVars)) {
    refetch(filterVars);
  }

  return {
    batchUploads,
    loading,
    refetch: () => refetch(filterVars)
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default compose(
  graphql(LOAD_UPLOADS_QUERY, {
    name: "BatchUploadsQuery",
    options: props => {
      return {
        variables: {
        },
      };
    },
  }),
  connect(mapStateToProps, mapDispatchToProps)
)(BatchUploadsTable);
