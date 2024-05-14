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
import EntryIcon from "@material-ui/icons/Receipt";
import InvoiceIcon from "@material-ui/icons/FeaturedPlayList";

const TableHeader = ({
  component: Component = Paper,
  classes = {},
  children = () => null,
  elevation = 1,
}) => {
  const {[window.location.hash]: defaultTab = 0} = {
    "#entries": 0,
    "#invoices": 1,
  };
  const [currentTab, setValue] = useState(defaultTab);

  function handleChange(event, newValue) {
    setValue(newValue);
  }

  function LinkTab(props) {
    return <Tab component="a" className={classes.tab} {...props} />;
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
              classes={{
                selected: classes.selected,
              }}
              label={
                <span className={classes.tabLabel}>
                  <EntryIcon className={classes.tabIcon} /> Entries
                </span>
              }
              href="#entries"
            />
            <LinkTab
              classes={{
                selected: classes.selected,
              }}
              label={
                <span className={classes.tabLabel}>
                  <InvoiceIcon className={classes.tabIcon} /> Invoices
                </span>
              }
              href="#invoices"
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
  },
  tabIcon: {
    marginRight: ".5rem",
    position: "relative",
    top: ".025em",
  },
  tabLabel: {
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "flex-start",
    alignContent: "baseline",
    textTransform: "capitalize",

    "& > svg": {
      top: "4px",
    },
  },
});

export default withStyles(styles)(TableHeader);
