import {Fragment, useState} from "react";
import {withStyles} from "@material-ui/core/styles";
import {useLazyQuery} from "@apollo/react-hooks";
import {useCurrentRoute} from "react-navi";
import {useFormikContext} from "formik";
import ErrorMessageList from "../../shared/error_message_list";

import Settings from "./settings";
import ChecksTable from "./checks_table";
import Footer from "./footer_container";

import PRINT_CHECKS_QUERY from "../../../graphql/queries/print_checks_search.gql";
const createSortWorker = () => new Worker("./sort.worker", {type: "module"});
const PrintChecksView = () => {
  const {
    data: {
      bank_account: {id: bankAccountId},
    },
  } = useCurrentRoute();

  const {
    values: {startDate, endDate},
    setFieldValue,
  } = useFormikContext();

  const [items, setItems] = useState([]);
  const [fetchItems] = useLazyQuery(PRINT_CHECKS_QUERY, {
    variables: {bankAccountId, startDate, endDate},
    fetchPolicy: "network-only",
    onCompleted: ({bankItemSearch = []} = {}) => {
      setFieldValue("checkedItems", {});
      const sortWorker = createSortWorker();
      sortWorker.onmessage = function ({data: items}) {
        setItems(items);
        sortWorker.terminate();
      };

      sortWorker.postMessage({
        items: bankItemSearch,
        sort: {name: "number", direction: "desc"},
        checkedItems: {},
      });
    },
  });

  const handleUpdateItems = async ({startDate, endDate}) => {
    await fetchItems({variables: {startDate, endDate}});
    setFieldValue("checkedItems", {});
  };

  return (
    <Fragment>
      <Settings {...{refetch: handleUpdateItems}} />
      <ErrorMessageList name="checkedItems" />
      <ChecksTable {...{items, setItems}} />
      <Footer />
    </Fragment>
  );
};

PrintChecksView.propTypes = {};

const styles = (theme) => ({});

export default withStyles(styles)(PrintChecksView);
