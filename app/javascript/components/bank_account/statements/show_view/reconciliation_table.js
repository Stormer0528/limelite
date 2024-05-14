import PropTypes from "prop-types";
import {lowerCase} from "lodash";
import {titleCase} from "humanize-plus";
import isEmpty from "lodash/isEmpty";
import {withStyles} from "@material-ui/core/styles";
import EmptyMessage from "./empty_message";
import {format} from "date-fns/esm";
import clsx from "clsx";

// Icons
import DepositIcon from "@material-ui/icons/AssignmentReturned";
import CheckIcon from "@material-ui/icons/OfflinePin";
import TransferIcon from "@material-ui/icons/CompareArrows";

// components
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";

import Tooltip from "@material-ui/core/Tooltip";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { USD } from "@utils";
import BalanceCell from "../../../shared/balance_cell";

const ReconciliationTable = ({
  items = {},
  selectedItems = {},
  editable,
  createToggleItemHandler = function () {},
  createSortHandler = function () {},
  classes = {},
  sort: {column: sortColumn = "", direction: sortDirection = "asc"} = {},
}) => {
  return (
    <div className="ReconciliationTable">
      <Table>
        <TableHead className={classes.headerRow}>
          <TableRow>
            <TableCell className={classes.typeCell}>
              {/* TYPE */}
              <Tooltip title="Sort" placement={"bottom-start"} enterDelay={300}>
                <TableSortLabel
                  active={sortColumn === "type"}
                  direction={sortDirection}
                  onClick={createSortHandler("type")}
                >
                  Type
                </TableSortLabel>
              </Tooltip>
            </TableCell>
            <TableCell className={classes.dateCell}>
              {/* DATE */}
              <Tooltip title="Sort" placement={"bottom-start"} enterDelay={300}>
                <TableSortLabel
                  active={sortColumn === "date"}
                  direction={sortDirection}
                  onClick={createSortHandler("date")}
                >
                  Date
                </TableSortLabel>
              </Tooltip>
            </TableCell>
            <TableCell>
              {/* CHECK# */}
              <Tooltip title="Sort" placement={"bottom-start"} enterDelay={300}>
                <TableSortLabel
                  active={sortColumn === "check#"}
                  direction={sortDirection}
                  onClick={createSortHandler("check#")}
                >
                  Chk/Jrn&nbsp;No.
                </TableSortLabel>
              </Tooltip>
            </TableCell>
            <TableCell>
              {/* NAME */}
              <Tooltip title="Sort" placement={"bottom-start"} enterDelay={300}>
                <TableSortLabel
                  active={sortColumn === "name"}
                  direction={sortDirection}
                  onClick={createSortHandler("name")}
                >
                  Name
                </TableSortLabel>
              </Tooltip>
            </TableCell>
            <TableCell className={classes.amountCell}>
              {/* AMOUNT */}
              <Tooltip title="Sort" placement={"bottom-start"} enterDelay={300}>
                <TableSortLabel
                  active={sortColumn === "amount"}
                  direction={sortDirection}
                  onClick={createSortHandler("amount")}
                >
                  <BalanceCell balance={"Amount"} />
                </TableSortLabel>
              </Tooltip>
            </TableCell>
            <TableCell style={{textAlign: "center"}}>Clear</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.values(items).map((item, i) => {
            const {
              id,
              type = "",
              number = "#",
              payee,
              vendor,
              amount,
              date,
            } = item;
            const selected = !!selectedItems[id];
            return (
              <TableRow
                key={`${id}-${i}`}
                className={clsx(classes.row, {[classes.selectedRow]: selected})}
              >
                <TableCell className={classes.typeCell}>
                  <div className={classes.typeCellContainer}>
                    {renderClassIcon(type)}
                    <span style={{marginLeft: ".5em"}}>
                      {"  "}
                      {`${titleCase(
                        lowerCase(type.replace("BankAccount::", ""))
                      )}`}
                    </span>
                  </div>
                </TableCell>
                <TableCell className={classes.dateCell}>
                  {format(date, "MM-dd-yyyy")}
                </TableCell>
                <TableCell>{number}</TableCell>
                <TableCell>{isEmpty(payee) ? vendor : payee}</TableCell>

                <TableCell
                  className={classes.creditCell}
                ><BalanceCell balance={USD(amount).format()} /></TableCell>
                <TableCell className={classes.checkCell}>
                  <FormControlLabel
                    className={classes.checkLabel}
                    control={
                      <Checkbox
                        disabled={!editable}
                        color="primary"
                        checked={selected}
                        className={classes.checkbox}
                        onChange={createToggleItemHandler(item)}
                      />
                    }
                  />
                </TableCell>
              </TableRow>
            );
          })}
          <tr />
        </TableBody>
      </Table>
      {Object.entries(items).length < 1 && <EmptyMessage />}
    </div>
  );
};

ReconciliationTable.propTypes = {
  items: PropTypes.array,
  account: PropTypes.object,
  editable: PropTypes.bool,
  selectedItems: PropTypes.object,
  sort: PropTypes.shape({
    direction: PropTypes.string,
    order: PropTypes.string,
  }),
  classes: PropTypes.object.isRequired,
  /*----- Callbacks ---------------- */
  createToggleItemHandler: PropTypes.func,
  createSortHandler: PropTypes.func,
};

const styles = (theme) => ({
  row: {
    borderBottom: "1px solid #e0e0e0",
    borderTop: "none",
  },
  checkLabel: {},
  checkbox: {},
  selectedRow: {
    background: "#CFD8DC",
    borderBottom: "1px solid #B0BEC5",
    borderTop: "1px solid #B0BEC5",
    color: "white",

    "& td": {
      border: "none",
      borderRadius: "0",
      borderColor: "transparent",
      color: "#455a64",
    },
  },
  headerRow: {
    background: "#f5f5f5",
    borderBottom: "1px solid #607D8B",
  },
  typeCell: {
    width: "6.5em",
    padding: "0 .35rem",
    textAlign: "center",
  },
  dateCell: {
    width: "6.5em",
    padding: "0 .35rem",
    textAlign: "center",
  },
  typeCellContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  typeIcon: {
    position: "relative",
    top: ".3em",
  },
  amountCell: {
    width: "6.5rem",
  },
  checkCell: {
    textAlign: "center",
    padding: "0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    borderBottomColor: "transparent",

    ["&:last-child"]: {
      paddingRight: 0,
      marginRight: 0,
    },
    ["& > label"]: {
      marginRight: 0,
    },
  },
});

// Helpers
//------------------------------------------------------------------------------
const renderClassIcon = (type) => {
  switch (type) {
    case "BankAccount::Deposit":
    case "Deposit":
      return <DepositIcon />;
    case "Check":
      return <CheckIcon />;
    case "AccountTransfer":
      return <TransferIcon />;
    default:
      return <i />;
  }
};

export default withStyles(styles)(ReconciliationTable);
