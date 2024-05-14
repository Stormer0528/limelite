import {compose} from "redux";
import {graphql} from "react-apollo";
import EntryQuery from "../../../../graphql/queries/load_entry.gql";

// Components
import Entry from "./entry";

export default compose(
  graphql(EntryQuery, {
    name: "entryQuery",
    props: ({entryQuery: {entry}}) => {
      return {entry};
    },
  })
)(Entry);
