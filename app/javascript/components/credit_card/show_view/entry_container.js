import {compose} from "redux";
import {graphql} from "react-apollo";
import EntryQuery from "../../../graphql/queries/load_entry.gql";

// Components
import Entry from "../../entries/views/index/entry";

export default compose(
  graphql(EntryQuery, {
    name: "entryQuery",
    props: ({ownProps: {itemPath, itemType}, entryQuery: {entry}}) => {
      return {entry, itemPath, itemType};
    },
  })
)(Entry);
