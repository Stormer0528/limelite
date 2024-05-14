import AuthSidebar from "./auth_sidebar";
import FiscalYearAlert from "./fiscal_year_alert";
import FiscalYearSelector from "./fiscal_year_selector";
import NavMenu from "./nav_menu";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import {makeStyles, ThemeProvider} from "@material-ui/core/styles";
import OrgIcon from "@material-ui/icons/AccountBalance";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
// Icons
import MenuIcon from "@material-ui/icons/Menu";
import {Root, Header, Content, SidebarTrigger} from "@mui-treasury/layout";
import siteTheme from "@shared/themes/site_theme";
import cx from "clsx";
import PropTypes from "prop-types";
import {Fragment, useState, useCallback} from "react";

const HeaderSpacer = () => <div style={{height: 68}} />;

const TopBar = ({
  title = "",
  logoPath = "",
  /* Refactor */
  earliestFiscalYear,
  fiscalYear,
  latestFiscalYear,
  children = <HeaderSpacer />,
  isAdminPage = false,
}) => {
  const classes = useStyles();
  const [sidebarOpen, openSidebar] = useState(false);
  const setSidebarOpen = useCallback(
    (open) => {
      if (open) {
        document
          .querySelector("html > body > main")
          .classList.add("with-right-sidebar");
      } else {
        document
          .querySelector("html > body > main")
          .classList.remove("with-right-sidebar");
      }
      openSidebar(open);
    },
    [openSidebar]
  );
  const [fiscalYearAlertOpen, setFiscalYearAlertOpen] = useState(
    fiscalYear !== latestFiscalYear
  );

  return (
    <Root config={config} className={cx(classes.root, "Topbar")}>
      {({headerStyles, sidebarStyles, collapsed, opened}) => (
        <Fragment>
          <CssBaseline />
          <ThemeProvider theme={siteTheme}>
            <Header className={classes.header} position="sticky">
              <Toolbar className={classes.toolbar}>
                <SidebarTrigger
                  className={cx(headerStyles.leftTrigger, classes.iconBtn)}
                >
                  {opened ? <ChevronLeftIcon /> : <MenuIcon />}
                </SidebarTrigger>

                {/*  Logo  */}
                <a className={classes.logoImg} href="/">
                  <img
                    alt="Limelite DS"
                    src={logoPath}
                    width="110"
                    height="33"
                  />
                </a>

                {/*  Org Title  */}
                <Typography variant="h2" className={classes.title}>
                  <OrgIcon className={classes.orgIcon} />
                  <span className={classes.titleText}>{title}</span>
                </Typography>

                {/*  Fiscal Year  */}
                {(!isAdminPage && (
                  <FiscalYearSelector
                    {...{earliestFiscalYear, fiscalYear, latestFiscalYear}}
                  />
                )) || <></>}

                {/*  Notifications Sidebar  */}
                {(!isAdminPage && (
                  <AuthSidebar open={sidebarOpen} handleOpen={setSidebarOpen} />
                )) || <></>}
              </Toolbar>
            </Header>
            <NavMenu {...{collapsed, opened, sidebarStyles, isAdminPage}} />
            <Content className={classes.content}>{children}</Content>

            {window.location.host.startsWith("abc.") && (
              <FiscalYearAlert
                open={fiscalYearAlertOpen}
                setOpen={setFiscalYearAlertOpen}
              />
            )}
          </ThemeProvider>
        </Fragment>
      )}
    </Root>
  );
};

TopBar.propTypes = {
  title: PropTypes.string,
  logoPath: PropTypes.string,
  earliestFiscalYear: PropTypes.number,
  fiscalYear: PropTypes.number,
  latestFiscalYear: PropTypes.number,
  children: PropTypes.any,
};

const useStyles = makeStyles((theme) => ({
  "@global": {
    "html > body > main": {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    "html > body > main.with-right-sidebar": {
      marginRight: "calc(295px + 1rem)",
      paddingRight: "1rem",
    },
  },
  root: {},
  content: {},
  header: {
    height: "64px",
    backgroundColor: "#263238",
    color: "white",
    paddingRight: theme.spacing(),
    position: "fixed",
  },
  toolbar: {
    padding: "0",
    color: "white",
    display: "grid",
    gridTemplateColumns: "64px 150px 1fr 195px 64px",

    "& button": {
      borderRadius: 0,
    },

    "& button:focus": {
      backgroundColor: "#43535a55",
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  logoImg: {
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
  },
  orgIcon: {
    color: "#cfd8dc",
    width: "1.25em",
    height: "1.25em",
    marginRight: ".25em",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: 200,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    display: "flex",
    width: "100%",
    height: "100%",
    alignItems: "baseline",
    justifyContent: "center",
  },
  titleText: {
    display: "inline-block",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    height: "100%",
    lineHeight: "4.5rem",
  },
  iconBtn: {
    color: "white",
  },
}));

export default TopBar;

const config = {
  autoCollapseDisabled: false,
  collapsedBreakpoint: "sm",
  heightAdjustmentDisabled: false,
  xs: {
    sidebar: {
      anchor: "left",
      hidden: false,
      inset: false,
      variant: "temporary",
      width: 240,
      collapsible: false,
      collapsedWidth: 64,
    },
    header: {
      position: "relative",
      clipped: false,
      offsetHeight: 56,
      persistentBehavior: "flexible",
    },
    content: {
      persistentBehavior: "flexible",
    },
    footer: {
      persistentBehavior: "flexible",
    },
  },
  sm: {
    sidebar: {
      anchor: "left",
      hidden: false,
      inset: false,
      variant: "persistent",
      width: 256,
      collapsible: true,
      collapsedWidth: 64,
    },
    header: {
      position: "relative",
      clipped: false,
      offsetHeight: 64,
      persistentBehavior: "flexible",
    },
    content: {
      persistentBehavior: "flexible",
    },
    footer: {
      persistentBehavior: "flexible",
    },
  },
  md: {
    sidebar: {
      anchor: "left",
      hidden: false,
      inset: false,
      variant: "persistent",
      width: 256,
      collapsible: true,
      collapsedWidth: 64,
    },
    header: {
      position: "relative",
      clipped: false,
      offsetHeight: 64,
      persistentBehavior: "fit",
    },
    content: {
      persistentBehavior: "fit",
    },
    footer: {
      persistentBehavior: "fit",
    },
  },
};
