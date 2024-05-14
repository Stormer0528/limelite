import {useEffect} from "react";
import isEmpty from "lodash/isEmpty";
import PropTypes from "prop-types";
import EntryModal from "./entry_modal";
import {useQuery} from "@apollo/react-hooks";
import LOAD_ENTRY from "../../../graphql/queries/load_entry.gql";

const EntryModalContainer = (props) => {
  const {entryId, ...rest} = props;
  const {data: {entry = {}} = {}, loading, error, refetch} = useQuery(
    LOAD_ENTRY,
    {
      variables: {entry_id: entryId},
      skip: !entryId,
    }
  );

  if (error) {
    console.error(error);
  }

  // Refetch if empty entry is returned
  useEffect(() => {
    if (entryId && !loading && isEmpty(entry)) {
      refetch();
    }
  }, [entryId, entry, loading, refetch]);

  return <EntryModal {...{loading, entry, ...rest}} />;
};

EntryModalContainer.propTypes = {
  entryId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default EntryModalContainer;
