import {Fragment} from "react";
import PropTypes from "prop-types";
import {useState} from "react";
import {withStyles} from "@material-ui/core/styles";

// Material UI
import Paper from "@material-ui/core/Paper";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import NoSsr from "@material-ui/core/NoSsr";
import Tab from "@material-ui/core/Tab";

// Icons
import EntryIcon from "../../shared/icons/entry_icon";
import InvoiceIcon from "../../shared/icons/invoice_icon";
import POIcon from "../../shared/icons/purchase_order_icon";
import FileUploadIcon from "../../shared/icons/file_upload_icon";

const TableHeader = ({
  component: Component = Paper,
  classes = {},
  children = () => null,
  elevation = 1,
}) => {
  const {[window.location.hash]: defaultTab = 0} = {
    "#entries": 0,
    "#purchase-orders": 1,
    "#invoices": 2,
    "#file-uploads": 3,
  };
  const [currentTab, setValue] = useState(defaultTab);

  function handleChange(event, newValue) {
    setValue(newValue);
  }

  function LinkTab(props) {
    return (
      <Tab
        component="a"
        classes={{selected: classes.selected, wrapper: classes.tab}}
        {...props}
      />
    );
  }

  return (
    <NoSsr>
      <Component className={classes.root} {...{elevation}}>
        <AppBar position="static" elevation={0}>
          <Tabs
            classes={{
              root: classes.tabRoot,
              indicator: classes.indicator,
            }}
            variant="fullWidth"
            value={currentTab}
            onChange={handleChange}
          >
            <LinkTab
              label={
                <Fragment>
                  <EntryIcon className={classes.tabIcon} />
                  <span className={classes.tabLabel}>Entries</span>
                </Fragment>
              }
              href="#entries"
            />
            <LinkTab
              label={
                <Fragment>
                  <POIcon className={classes.tabIcon} />
                  <span className={classes.tabLabel}>Purchase Orders</span>
                </Fragment>
              }
              href="#purchase-orders"
            />
            <LinkTab
              label={
                <Fragment>
                  <InvoiceIcon className={classes.tabIcon} />
                  <span className={classes.tabLabel}>Invoices</span>
                </Fragment>
              }
              href="#invoices"
            />
            <LinkTab
              label={
                <Fragment>
                  <FileUploadIcon className={classes.tabIcon} />
                  <span className={classes.tabLabel}>File Uploads</span>
                </Fragment>
              }
              href="#file-uploads"
            />
          </Tabs>
        </AppBar>
        {children({currentTab})}
      </Component>
    </NoSsr>
  );
};

TableHeader.propTypes = {
  component: PropTypes.node,
  TitleIcon: PropTypes.any,
  title: PropTypes.string,
  loading: PropTypes.bool,
  loadingMessage: PropTypes.string,
  elevation: PropTypes.number,
  children: PropTypes.any,
  classes: PropTypes.object,
};

const styles = (theme) => ({
  root: {
    flexBasis: " 500px",
    minHeight: "250px",
    flex: "auto",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    color: "#546E7A",
  },
  selected: {
    backgroundColor: "#CFD8DC",
  },
  indicator: {
    backgroundColor: "#90a4ae",
  },
  tabRoot: {
    background: "#f5f5f5",
    color: "#546E7A",
  },
  tab: {
    fontSize: "18px",
    display: "flex",
    flexDirection: "row",
    /* override MUI transform: caps */
    textTransform: "capitalize",
  },
  tabIcon: {
    marginRight: ".25rem",
  },
});

export default withStyles(styles)(TableHeader);
