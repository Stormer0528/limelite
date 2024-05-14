import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import clsx from "clsx";

import Breadcrumb from "./breadcrumb";
import {Link} from "react-router-dom";

import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";

import ReportIcon from "@material-ui/icons/Assignment";
import BalanceSheetIcon from "@material-ui/icons/PieChart";
import AgingReportIcon from "@material-ui/icons/History";
import CashFlowReportIcon from "@material-ui/icons/AttachMoney";
import ProfitLossReportIcon from "@material-ui/icons/ImportExport";
import OtherReportIcon from "@material-ui/icons/Equalizer";

const IndexPage = ({classes = {}}) => {
  return (
    <section className={classes.root2}>
      <Breadcrumb />

      <Grid container className={clsx(classes.container)}>
        <Grid item>
          <List
            subheader={
              <ListSubheader component="div" className={classes.subheader}>
                <ListItemIcon>
                  <AgingReportIcon />
                </ListItemIcon>
                Aging Reports
              </ListSubheader>
            }
            className={classes.root}
          >
            <ListItem
              button
              className={classes.linkBtn}
              to="/ap-aging-report"
              component={Link}
            >
              <ListItemIcon>
                <ReportIcon />
              </ListItemIcon>
              <ListItemText primary="A/P Aging Report" />
            </ListItem>
            <ListItem
              button
              className={classes.linkBtn}
              to="/ar-aging-report"
              component={Link}
            >
              <ListItemIcon>
                <ReportIcon />
              </ListItemIcon>
              <ListItemText primary="A/R Aging Report" />
            </ListItem>
          </List>
        </Grid>

        {/* Balance Sheets */}
        <Grid item>
          <List
            subheader={
              <ListSubheader component="div" className={classes.subheader}>
                <ListItemIcon>
                  <BalanceSheetIcon />
                </ListItemIcon>
                Balance Sheets
              </ListSubheader>
            }
            className={classes.root}
          >
            <ListItem
              button
              className={classes.linkBtn}
              to="/balance-sheet"
              component={Link}
            >
              <ListItemIcon>
                <ReportIcon />
              </ListItemIcon>
              <ListItemText primary="Balance Sheet" />
            </ListItem>
            <ListItem
              button
              className={classes.linkBtn}
              to="/balance-sheet-by-month"
              component={Link}
            >
              <ListItemIcon>
                <ReportIcon />
              </ListItemIcon>
              <ListItemText primary="Balance Sheet by Month" />
            </ListItem>
            <ListItem
              button
              className={classes.linkBtn}
              to="/balance-sheet-by-resource"
              component={Link}
            >
              <ListItemIcon>
                <ReportIcon />
              </ListItemIcon>
              <ListItemText primary="Balance Sheet By Resource" />
            </ListItem>
            <ListItem
              button
              className={classes.linkBtn}
              to="/comparative-balance-sheet"
              component={Link}
            >
              <ListItemIcon>
                <ReportIcon />
              </ListItemIcon>
              <ListItemText primary="Balance Sheet Comparative" />
            </ListItem>
          </List>
        </Grid>

        {/* Cash Flow Reports */}
        <Grid item>
          <List
            subheader={
              <ListSubheader component="div" className={classes.subheader}>
                <ListItemIcon>
                  <CashFlowReportIcon />
                </ListItemIcon>
                Cash Flow
              </ListSubheader>
            }
            className={classes.root}
          >
            <ListItem
              button
              className={classes.linkBtn}
              to="/cash-flow-report"
              component={Link}
            >
              <ListItemIcon>
                <ReportIcon />
              </ListItemIcon>
              <ListItemText primary="Cash Flow Report" />
            </ListItem>
            <ListItem
              button
              className={classes.linkBtn}
              to="/monthly-cash-flow-report"
              component={Link}
            >
              <ListItemIcon>
                <ReportIcon />
              </ListItemIcon>
              <ListItemText primary="Cash Flow By Month" />
            </ListItem>
          </List>
        </Grid>

        {/* Profit and Loss Reports */}
        <Grid item>
          <List
            subheader={
              <ListSubheader component="div" className={classes.subheader}>
                <ListItemIcon>
                  <ProfitLossReportIcon />
                </ListItemIcon>
                Profit &amp; Loss
              </ListSubheader>
            }
            className={classes.root}
          >
            <ListItem
              button
              className={classes.linkBtn}
              to="/profit-and-loss-statement"
              component={Link}
            >
              <ListItemIcon>
                <ReportIcon />
              </ListItemIcon>
              <ListItemText primary="Profit &amp; Loss Statement" />
            </ListItem>
            <ListItem
              button
              className={classes.linkBtn}
              to="/monthly-profit-and-loss-statement"
              component={Link}
            >
              <ListItemIcon>
                <ReportIcon />
              </ListItemIcon>
              <ListItemText primary="Profit &amp; Loss Statement By Month" />
            </ListItem>
            <ListItem
              button
              className={classes.linkBtn}
              to="/profit-and-loss-by-resource-report"
              component={Link}
            >
              <ListItemIcon>
                <ReportIcon />
              </ListItemIcon>
              <ListItemText primary="Profit &amp; Loss Statement By Resource" />
            </ListItem>
            <ListItem
              button
              className={classes.linkBtn}
              to="/comparative-profit-and-loss-statement"
              component={Link}
            >
              <ListItemIcon>
                <ReportIcon />
              </ListItemIcon>
              <ListItemText primary="Profit &amp; Loss Comparative" />
            </ListItem>
            <ListItem
              button
              className={classes.linkBtn}
              to="/budget-vs-actual"
              component={Link}
            >
              <ListItemIcon>
                <ReportIcon />
              </ListItemIcon>
              <ListItemText primary="Budget vs. Actual Report" />
            </ListItem>
          </List>
        </Grid>

        {/* Other Reports */}
        <Grid item>
          <List
            subheader={
              <ListSubheader
                component="div"
                className={classes.subheader}
                color="primary"
              >
                <ListItemIcon>
                  <OtherReportIcon />
                </ListItemIcon>
                Other Reports
              </ListSubheader>
            }
            className={classes.root}
          >
            <ListItem
              button
              className={classes.linkBtn}
              to="/vendor-1099-report"
              component={Link}
            >
              <ListItemIcon>
                <ReportIcon />
              </ListItemIcon>
              <ListItemText primary="Vendor 1099 Report" />
            </ListItem>
            <ListItem
              button
              className={classes.linkBtn}
              to="/vendor-report"
              component={Link}
            >
              <ListItemIcon>
                <ReportIcon />
              </ListItemIcon>
              <ListItemText primary="Vendor Report" />
            </ListItem>
            <ListItem
              button
              className={classes.linkBtn}
              to="/check-register-report"
              component={Link}
            >
              <ListItemIcon>
                <ReportIcon />
              </ListItemIcon>
              <ListItemText primary="Check Register" />
            </ListItem>

            <ListItem
              button
              className={classes.linkBtn}
              href="/entries"
              component="a"
            >
              <ListItemIcon>
                <ReportIcon />
              </ListItemIcon>
              <ListItemText primary="Entries and General Ledgers" />
            </ListItem>
            <ListItem
              button
              className={classes.linkBtn}
              href="/reconciliations"
              component="a"
            >
              <ListItemIcon>
                <ReportIcon />
              </ListItemIcon>
              <ListItemText primary="Reconciliations" />
            </ListItem>
          </List>
        </Grid>
      </Grid>
    </section>
  );
};

IndexPage.propTypes = {
  classes: PropTypes.object,
};

const styles = (theme) => ({
  container: {
    width: "100%",
    maxWidth: "100vw",
    marginTop: "150px",
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gridColumnGap: "8px",

    "@media (max-width: 800px)": {
      gridTemplateColumns: "repeat(2, 1fr)",
      gridRowGap: "2.5em",
    },
  },
  subheader: {
    fontSize: "1.5rem",
    fontWeight: "400",
    lineHeight: "1",
    marginBottom: ".5em",
    color: "#74ac4b",
    display: "flex",
    alignItems: "center",
    padding: "4px 8px",
    borderBottom: "1px solid #c6c6c6",
  },
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  linkBtn: {
    fontSize: "1.125rem",
    fontWeight: "300",
    padding: "12px 8px !important",

    "& > div > span": {
      fontSize: "1.125rem",
    },
  },
  checkRegister: {
    backgroundColor: "#00695C",
    "& i.material-icons": {
      color: "#E0F2F1",
    },
  },
});

export default withStyles(styles)(IndexPage);
