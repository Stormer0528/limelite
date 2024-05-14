import APPROVAL_LOGS_QUERY from "../../graphql/queries/approval_logs.gql";
import ORGANIZATION_QUERY from "../../graphql/queries/organizations.gql";
import {createUpdateQuery} from "../../utils";
import Filter from "./filter";
import Tooltip from "@material-ui/core/Tooltip";
import PropTypes from "prop-types";
import {Fragment, useState} from "react";
import {useQuery} from "react-apollo";
import TextRenderer from "searchable_table/components/defaults/advanced_text_column";
import DateRenderer from "searchable_table/components/defaults/date_column";
import LinkRenderer from "searchable_table/components/defaults/link_renderer";
import SearchableTable from "searchable_table/searchable_table";
import {textSearch} from "searchable_table/utils/search_functions";

const ApprovalLogsTable = () => {
  const [filter, setFilter] = useState({
    reportPeriod: "",
    startDate: "",
    endDate: "",
    organizationId: 29,
  });

  const {data: {organizationSearch = []} = {}} = useQuery(ORGANIZATION_QUERY, {
    fetchPolicy: "cache-and-network",
  });

  const {
    fetchMore: fetchMoreRows,
    data: {
      stateChangeLogSearchConnection: {
        nodes = [],
        pageInfo: {endCursor} = {},
      } = {},
    } = {},
  } = useQuery(APPROVAL_LOGS_QUERY, {
    fetchPolicy: "cache-and-network",
    variables: {
      reason: "",
      fromState: "",
      toState: "",
      organizationId: filter.organizationId,
      startDate: filter.startDate,
      endDate: filter.endDate,
      first: 25,
    },
  });

  const fetchMore = async () => {
    await fetchMoreRows({
      variables: {
        cursor: endCursor,
      },
      updateQuery: createUpdateQuery({
        fieldName: "stateChangeLogSearchConnection",
        objectName: "nodes",
      }),
    });
  };

  if (!organizationSearch.length) return null;

  const currentOrg = organizationSearch.find(
    (organization) => Number(organization.id) === Number(filter.organizationId)
  );
  const prefix = `${location.protocol}//${currentOrg.subdomain}.${location.host}`;

  const formattedLogs = nodes.map((log) => {
    const {dateTime, user} = log;
    const [datePart, timePart] = dateTime.split(" ");

    return {
      ...log,
      userName: user.firstName + " " + user.lastName,
      updatedAt: datePart + " " + timePart,
      vendorName: log.invoice.vendor.name,
      vendorPath: prefix + log.invoice.vendor.path,
      invoiceNumber: log.invoice.number,
      invoicePath: prefix + log.invoice.path,
    };
  });

  return (
    <Fragment>
      <Filter
        filter={filter}
        setFilter={setFilter}
        organizations={organizationSearch}
      />

      <SearchableTable
        data={formattedLogs}
        fetchMore={fetchMore}
        headers={[
          "Vendor Name",
          "Invoice #",
          "From State",
          "To State",
          "User",
          "Date",
          "Reason",
        ]}
        cells={[
          LinkRenderer("vendorName", "vendorPath", {
            columnWidth: 100,
            flexGrow: 0.75,
          }),
          LinkRenderer("invoiceNumber", "invoicePath", {
            columnWidth: 115,
            flexGrow: 0.5,
          }),
          TextRenderer("fromState", {
            columnWidth: 100,
            flexGrow: 0.5,
          }),
          TextRenderer("toState", {
            columnWidth: 100,
            flexGrow: 0.5,
          }),
          TextRenderer("userName", {
            columnWidth: 70,
            flexGrow: 1,
          }),
          DateRenderer("updatedAt", {
            flexGrow: 0.75,
            columnWidth: 100,
            inputDateFormat: "yyyy-MM-dd HH:mm:ss",
            dateFormat: "MM/dd/yyyy HH:mm:ss",
          }),
          ReasonCellRenderer("reason", {
            columnWidth: 100,
            flexGrow: 0.75,
          }),
        ]}
      />
    </Fragment>
  );
};

ApprovalLogsTable.propTypes = {
  loading: PropTypes.bool,
};

const ReasonCellRenderer = (
  textcol,
  {
    disableSort = false,
    columnWidth = 150,
    flexGrow = 1,
    sortFunc = textSearch(textcol),
    align = "left",
  } = {}
) => {
  const renderFunc = ({rowData = {}}) => {
    return (
      <Tooltip
        title={rowData[textcol]}
        placement={"bottom-start"}
        enterDelay={100}
      >
        <div
          className={`${align}-align`}
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {rowData[textcol]}
        </div>
      </Tooltip>
    );
  };

  renderFunc.disableSort = disableSort;
  renderFunc.columnWidth = columnWidth;
  renderFunc.flexGrow = flexGrow;
  renderFunc.customSortFunc = sortFunc;

  renderFunc.propTypes = {
    rowData: PropTypes.shape({
      [textcol]: PropTypes.string.isRequired,
    }),
  };

  return renderFunc;
};

export default ApprovalLogsTable;
