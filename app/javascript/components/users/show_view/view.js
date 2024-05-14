import PropTypes from "prop-types";
import get from "lodash/get";
import {useCallback, useState} from "react";
import {useTheme, withStyles} from "@material-ui/core/styles";

import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Fade from "@material-ui/core/Fade";
import Form from "../form";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import SwipeableViews from "react-swipeable-views";
import {useQuery} from "@apollo/react-hooks";

import CurrentUserHeader from "../current_user_header";

import CURRENT_USER_QUERY from "@graphql/queries/current_user.gql";
import FileUploadsTable from "./file_uploads_table";
import AuthorizationsTable from "./authorizations_table";

import Icon from "@shared/icons/user_icon";
import InsertDriveFileOutlinedIcon from "@material-ui/icons/InsertDriveFileOutlined";
import UserIcon from "@material-ui/icons/AccountCircleOutlined";
import AuthIcon from "@shared/icons/authorization_icon";

const View = ({classes = {}}) => {
  const theme = useTheme();
  const {loading, data: {currentUser} = {}} = useQuery(CURRENT_USER_QUERY);

  const {id} = currentUser || {currentUserGroup: {}};
  const itemsAwaitingAuthorization = get(
    currentUser,
    "currentUserGroup.itemsAwaitingAuthorization",
    []
  );

  const [currentTab, setCurrentTab] = useState(0);
  const handleTabClick = useCallback(
    (e, tabIndex) => {
      e.preventDefault();
      setCurrentTab(tabIndex);
    },
    [setCurrentTab]
  );

  if (loading) {
    return null;
  }

  return (
    <section className={classes.root}>
      <header className={classes.header}>
        <h3 className={classes.title} data-cy="page-header">
          <Icon className={classes.titleIcon} /> User Account
        </h3>
      </header>
      <Card className={classes.grow}>
        <CurrentUserHeader />
        <Tabs
          variant="fullWidth"
          value={currentTab}
          onChange={handleTabClick}
          aria-label="User Tabs"
          className={classes.tabs}
        >
          <Tab
            label={
              <span className={classes.tabText} data-cy="auth-tab">
                <AuthIcon /> Pending Authorizations
              </span>
            }
          />
          <Tab
            label={
              <span className={classes.tabText} data-cy="files-tab">
                <InsertDriveFileOutlinedIcon /> Uploaded Files
              </span>
            }
          />
          <Tab
            label={
              <span className={classes.tabText} data-cy="detail-tab">
                <UserIcon /> User Details
              </span>
            }
          />
        </Tabs>
        <CardContent className={classes.grow} id="user-card-container">
          <SwipeableViews
            axis={theme.direction === "rtl" ? "x-reverse" : "x"}
            index={currentTab}
            onChangeIndex={handleTabClick}
          >
            <TabPanel
              classes={{
                grow: classes.grow,
              }}
              value={currentTab}
              index={0}
              dir={theme.direction}
            >
              <AuthorizationsTable items={itemsAwaitingAuthorization} />
            </TabPanel>
            <TabPanel
              classes={{
                grow: classes.grow,
              }}
              value={currentTab}
              index={1}
              dir={theme.direction}
            >
              <FileUploadsTable creatorId={id} />
            </TabPanel>
            <TabPanel value={currentTab} index={2} dir={theme.direction}>
              {!loading && currentUser && (
                <Fade in={!loading}>
                  <Form user={currentUser} readOnly hidePassword disabled />
                </Fade>
              )}
            </TabPanel>
          </SwipeableViews>
        </CardContent>
      </Card>
    </section>
  );
};

View.propTypes = {
  classes: PropTypes.object.isRequired,
};

const styles = () => ({
  root: {
    marginBottom: "5rem",
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
  },
  grow: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
  },
  tabs: {
    borderBottom: "1px solid #e0e0e0",

    "& button:focus": {
      backgroundColor: "#f5f5f5",
    },
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
  tabText: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    "& > svg": {
      marginRight: ".35rem",
      position: "relative",
      top: "-0.125rem",
    },
  },
});

export default withStyles(styles)(View);

// Helper Components
//------------------------------------------------------------------------
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
      <Fade in={value === index}>
        <Box>{children}</Box>
      </Fade>
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};
