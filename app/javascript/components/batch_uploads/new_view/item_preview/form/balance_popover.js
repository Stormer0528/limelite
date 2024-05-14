import {Fragment} from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import {makeStyles} from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import Popover from "@material-ui/core/Popover";
import PopupState, {bindTrigger, bindPopover} from "material-ui-popup-state";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableFooter from "@material-ui/core/TableFooter";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

// Icons
import InfoIcon from "@material-ui/icons/InfoOutlined";
import NegativeBalanceIcon from "mdi-material-ui/ArrowDownBoldCircleOutline";
import PositiveBalanceIcon from "mdi-material-ui/ArrowUpBoldCircleOutline";
import BalancedBalanceIcon from "@material-ui/icons/PauseCircleOutline";

const BalanceIcon = ({balance = "$0.00"}) => {
  const balanced =
    balance === "$0.00"
      ? "balanced"
      : balance.match(/-/)
      ? "negative"
      : "positive";

  switch (balanced) {
    case "negative":
      return <NegativeBalanceIcon />;
    case "positive":
      return <PositiveBalanceIcon />;
    case "balanced":
    default:
      return <BalancedBalanceIcon />;
  }
};

BalanceIcon.propTypes = {
  balance: PropTypes.string,
};

const BalancePopover = ({total = {balance: "$0.00"}, groupedItems = {}}) => {
  const cl = useStyles();
  const totalBalanceClass =
    total.balance === "$0.00"
      ? "balanced"
      : total.balance.match(/-/)
      ? "negative"
      : "positive";
  return (
    <PopupState variant="popover" popupId="balances-popup">
      {(popupState) => (
        <Fragment>
          <IconButton
            className={cl.iconBtn}
            variant="contained"
            color="primary"
            {...bindTrigger(popupState)}
          >
            <InfoIcon />
          </IconButton>
          <Popover
            {...bindPopover(popupState)}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
          >
            <Box>
              <h4 className={cl.title}>
                Entry Balances
                <span className={clsx("balanced-text", totalBalanceClass)}>
                  <BalanceIcon balance={total.balance} />
                </span>
              </h4>
              <Table aria-label="Balances Table" size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Fund</TableCell>
                    <TableCell>Resource</TableCell>
                    <TableCell align="center">Credits</TableCell>
                    <TableCell align="center">Debits</TableCell>
                    <TableCell align="center">Balance</TableCell>
                  </TableRow>
                </TableHead>
                {Object.values(groupedItems).length > 1 && (
                  <TableBody>
                    {Object.entries(groupedItems).map(
                      ([label, {credits, debits, balance}]) => {
                        const [fund, resource] = label.split("-");
                        const BalanceIcon =
                          balance === "$0.00"
                            ? "balanced"
                            : balance.match(/-/)
                            ? NegativeBalanceIcon
                            : PositiveBalanceIcon;
                        const balanceClass =
                          balance === "$0.00"
                            ? "balanced"
                            : balance.match(/-/)
                            ? "negative"
                            : "positive";

                        return (
                          <TableRow key={label}>
                            <TableCell>
                              <span className={cl.fundCode}>
                                {fund === "undefined" ? (
                                  <i className={cl.pending}>Pending</i>
                                ) : (
                                  fund
                                )}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className={cl.resourceCode}>
                                {resource === "undefined" ? (
                                  <i className={cl.pending}>Pending</i>
                                ) : (
                                  resource
                                )}
                              </span>
                            </TableCell>
                            <TableCell align="right" className={cl.creditCell}>
                              {credits}
                            </TableCell>
                            <TableCell align="right" className={cl.debitCell}>
                              {debits}
                            </TableCell>
                            <TableCell
                              align="right"
                              className={clsx(cl.balance, balanceClass)}
                            >
                              <BalanceIcon />
                              {balance}
                            </TableCell>
                          </TableRow>
                        );
                      }
                    )}
                  </TableBody>
                )}
                <TableFooter>
                  <TableRow className={cl.totalRow}>
                    <TableCell className={cl.footerTitle} colSpan={2}>
                      Total
                    </TableCell>
                    <TableCell align="right" className={cl.creditFooter}>
                      {total.totalCredits}
                    </TableCell>
                    <TableCell align="right" className={cl.debitFooter}>
                      {total.totalDebits}
                    </TableCell>
                    <TableCell
                      align="right"
                      className={clsx(cl.footerBalance, totalBalanceClass)}
                    >
                      {total.balance}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </Box>
          </Popover>
        </Fragment>
      )}
    </PopupState>
  );
};

BalancePopover.propTypes = {
  total: PropTypes.shape({
    balance: PropTypes.string,
  }),
  groupedItems: PropTypes.object,
};

const useStyles = makeStyles(() => ({
  iconBtn: {
    padding: 0,
    marginRight: ".5rem",
  },
  creditCell: {
    fontWeight: "400",
    color: "#388e3c",
    border: "2px solid #388e3c",
    borderWidth: "0 1px",
    background: "#E8F5E9",
  },
  debitCell: {
    fontWeight: "400",
    color: "#B71C1C",
    border: "2px solid #B71C1C",
    borderWidth: "0 1px",
    background: "#FFEBEE",
  },
  creditFooter: {
    fontWeight: "500",
    color: "#388e3c",
    border: "2px solid #79b178",
    borderWidth: "0 1px",
    backgroundColor: "#ebf2eb",
  },
  debitFooter: {
    fontWeight: "500",
    border: "2px solid #cd6663",
    borderWidth: "0 1px",
    color: "#B71C1C",
    backgroundColor: "#f9ecee",
  },
  balance: {
    display: "flex",
    borderBottom: "none",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",

    "& svg": {
      marginRight: ".5rem",
      opacity: ".75",
      height: "1.125rem",
      width: "1.125rem",
    },

    "&.positive": {
      color: "#388e3c",
    },

    "&.negative": {
      color: "#b71f1e",
    },
  },
  footerBalance: {
    fontWeight: "bold",
    "&.positive": {
      color: "#388e3c",
    },

    "&.negative": {
      color: "#b71f1e",
    },
  },
  fundCode: {
    fontWeight: "bold",
    color: "#5975a0",
  },
  resourceCode: {
    fontWeight: "bold",
    color: "#607D8B",
  },
  pending: {
    fontWeight: "200",
    color: "#BDBDBD",
  },
  totalRow: {
    backgroundColor: "#F5F5F5",
  },
  footerTitle: {
    fontWeight: "bold",
    fontSize: ".9em",
  },
  title: {
    margin: ".125em 0 0",
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "1px solid #eee",
    fontSize: "1.75rem",
    padding: ".25rem 1rem .35rem",

    "& span.balanced-text": {
      color: "#4DD0E1",
      fontSize: 16,
      fontWeight: 300,
      fontVariant: "all-petite-caps",
      textTransform: "lowercase",
    },

    "& span.balanced-text.balanced svg": {
      transform: "rotate(90deg)",
      color: "#03A9F4",
    },

    "& span.balanced-text.positive": {
      color: "#388e3c",
    },
    "& span.balanced-text.negative": {
      color: "#b71f1e",
    },
  },
}));

export default BalancePopover;
