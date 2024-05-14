import PropTypes from "prop-types";

import {useCallback, useState} from "react";
import {withStyles} from "@material-ui/core/styles";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Form from "../form";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

// import Navlinks from "./navlinks";

import Icon from "@material-ui/icons/Help";

const View = ({classes = {}}) => {
  const [currentTab, setCurrentTab] = useState(0);
  const handleTabClick = useCallback(
    (tab) => (e) => {
      e.preventDefault();
      setCurrentTab(tab);
    },
    [setCurrentTab]
  );

  return (
    <section className={classes.root}>
      <header className={classes.header}>
        <h3 className={classes.title}>
          <Icon className={classes.titleIcon} /> New Users
        </h3>
      </header>
      <Card>
        <Tabs
          value={currentTab}
          onChange={handleTabClick}
          aria-label="simple tabs example"
        >
          <Tab label="User Files" />
        </Tabs>
        <CardContent>
          <TabPanel value={currentTab} index={0}>
            <h3>User Files</h3>
          </TabPanel>
          <TabPanel value={currentTab} index={0}>
            <h3>User Form</h3>
          </TabPanel>
          <Form />
        </CardContent>
      </Card>
    </section>
  );
};

View.propTypes = {
  classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
  root: {
    marginBottom: "5rem",
  },
  header: {
    display: "grid",
    gridTemplateColumns: "1fr 315px",
    alignItems: "baseline",
    marginBottom: "-0.125rem",
    padding: "0 .5rem .25rem",
    borderTop: "1px solid #f0f0f0",
    borderRadius: "4px 4px 0 0",
    background: "#f0f0f087",
  },
  title: {
    margin: 0,
  },
  titleIcon: {
    fontSize: "2.35rem !important",
    position: "relative",
    top: ".065em",
    color: "#455A64",
  },
});

export default withStyles(styles)(View);

//
//
function TabPanel(props) {
  const {children, value, index, ...other} = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`nav-tabpanel-${index}`}
      aria-labelledby={`nav-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};
