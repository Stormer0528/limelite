import UploadBtn from "./filestack_upload_btn";
import {compose} from "redux";
import {graphql} from "react-apollo";
import gql from "graphql-tag";

export default compose(
  graphql(
    gql`
      query {
        filestack {
          clientName
          apikey
          policy
          signature
          security {
            policy
            signature
          }
        }
      }
    `,
    {
      name: "filestack",
      props: ({filestack: {filestack = {}}}) => {
        return {...filestack};
      },
      options: {
        fetchPolicy: "network-only",
      },
    }
  )
)(UploadBtn);
