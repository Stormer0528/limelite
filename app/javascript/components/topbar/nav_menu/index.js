import NewEntryBtn from "../../new_entry_btn";
import CurrentUserHeader from "./current_user_header";
import OrgSelector from "./org_selector";
import sitemap from "./sitemap";
import {useQuery} from "@apollo/react-hooks";
import PERMS_QUERY from "@graphql/queries/nav_permissions.gql";
// MUI
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Tooltip from "@material-ui/core/Tooltip";
import {makeStyles, useTheme} from "@material-ui/core/styles";
import LogoutIcon from "@material-ui/icons/Cancel";
import FullBackIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
// Icons
import ChevronLeftIcon from "@material-ui/icons/FirstPage";
import ImportEntriesIcon from "@material-ui/icons/LibraryAdd";
import AdminDashboardIcon from "@material-ui/icons/VerticalSplit";
import Menu from "@mui-treasury/components/menu/collapsible";
import {Sidebar, CollapseBtn, SidebarTrigger} from "@mui-treasury/layout";
import AccountIcon from "@shared/icons/account_icon";
import AdminIcon from "@shared/icons/admin_icon";
import BankIcon from "@shared/icons/bank_account_icon";
import CreditCardIcon from "@shared/icons/credit_card_icon";
import CustomerIcon from "@shared/icons/customer_icon";
import EntryIcon from "@shared/icons/entry_icon";
import FunctionsIcon from "@shared/icons/function_icon";
import FundsIcon from "@shared/icons/fund_icon";
import GoalsIcon from "@shared/icons/goal_icon";
import LocationIcon from "@shared/icons/location_icon";
import ObjectsIcon from "@shared/icons/object_icon";
import OrgIcon from "@shared/icons/organization_icon";
import ReportIcon from "@shared/icons/report_icon";
import ResourcesIcon from "@shared/icons/resource_icon";
import SchoolIcon from "@shared/icons/school_icon";
import UsersIcon from "@shared/icons/user_icon";
import VendorIcon from "@shared/icons/vendor_icon";
import YearsIcon from "@shared/icons/year_icon";
import cx from "clsx";
import PropTypes from "prop-types";
import {useEffect, Component} from "react";

const NavMenu = ({collapsed, opened, sidebarStyles, isAdminPage}) => {
  const classes = useStyles();
  const {
    data: {
      reports: {index: canViewReports = false} = {},
      entry: {create: canCreateEntry = false} = {},
      bankAccounts: {index: canViewBankAccounts = false} = {},
      entries: {index: canViewEntries = false} = {},
      creditCards: {index: canViewCreditCards = false} = {},
      customer: {index: canViewCustomer = false} = {},
      vendors: {index: canViewVendors = false} = {},
      accounts: {index: canViewAccounts = false} = {},
      admin: {index: canViewAdmin = false} = {},
    } = {},
  } = useQuery(PERMS_QUERY);

  const {models: modelColors = {}} = useTheme();
  useEffect(() => {
    const tag = document.querySelector("html > body > main");
    if (opened) {
      tag.classList.add("with-left-sidebar");
    } else {
      tag.classList.remove("with-left-sidebar");
    }
    if (collapsed) {
      tag.classList.add("collapsed");
    } else {
      tag.classList.remove("collapsed");
    }
  }, [`${collapsed}`, `${opened}`]);

  return (
    <Sidebar>
      <CurrentUserHeader collapsed={collapsed} />
      {(!isAdminPage && (
        <div className={sidebarStyles.container}>
          {canViewReports && (
            <ListItemLink href={sitemap["reportsPath"]}>
              <Tooltip title="Reports" placement="right">
                <ListItemIcon>
                  <ReportIcon
                    style={{color: modelColors["Report"].backgroundColor}}
                  />
                </ListItemIcon>
              </Tooltip>
              <ListItemText>Reports</ListItemText>
            </ListItemLink>
          )}

          {/* New Entry Btn */}
          {canCreateEntry && <NewEntryBtn />}

          {canCreateEntry && (
            <ListItemLink button href={sitemap["importEntries"]}>
              <ListItemIcon>
                <ImportEntriesIcon />
              </ListItemIcon>
              <ListItemText>Import Entries</ListItemText>
            </ListItemLink>
          )}

          <Divider />
          <ListItemLink href="/signout">
            <Tooltip title="Logout" placement="right">
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
            </Tooltip>
            <ListItemText>Logout</ListItemText>
          </ListItemLink>
          <Divider />

          {/* Current Org Dropdown */}
          <OrgSelector />
          {canViewAccounts && (
            <Menu
              className={classes.submenu}
              renderToggle={({onClick, collapsed}) => (
                <Menu.Row>
                  <ListItemLink button href={sitemap["accountsPath"]}>
                    <Tooltip title="Accounts" placement="right">
                      <ListItemIcon>
                        <AccountIcon
                          style={{color: modelColors["Account"].menuColor}}
                        />
                      </ListItemIcon>
                    </Tooltip>
                    <ListItemText>Accounts</ListItemText>
                  </ListItemLink>
                  <Menu.Action button toggled={collapsed} onClick={onClick} />
                </Menu.Row>
              )}
            >
              <Divider />

              <ListItemLink
                inset="true"
                button
                href={sitemap["accountFundsPath"]}
              >
                <ListItemIcon>
                  <FundsIcon />
                </ListItemIcon>
                <ListItemText>Funds</ListItemText>
              </ListItemLink>

              <ListItemLink
                inset="true"
                button
                href={sitemap["accountResourcesPath"]}
              >
                <ListItemIcon>
                  <ResourcesIcon />
                </ListItemIcon>
                <ListItemText>Resources</ListItemText>
              </ListItemLink>

              <ListItemLink
                inset="true"
                button
                href={sitemap["accountYearsPath"]}
              >
                <ListItemIcon>
                  <YearsIcon />
                </ListItemIcon>
                <ListItemText>Years</ListItemText>
              </ListItemLink>

              <ListItemLink
                inset="true"
                button
                href={sitemap["accountGoalsPath"]}
              >
                <ListItemIcon>
                  <GoalsIcon />
                </ListItemIcon>
                <ListItemText>Goals</ListItemText>
              </ListItemLink>

              <ListItemLink
                inset="true"
                button
                href={sitemap["accountFunctionsPath"]}
              >
                <ListItemIcon>
                  <FunctionsIcon />
                </ListItemIcon>
                <ListItemText>Functions</ListItemText>
              </ListItemLink>

              <ListItemLink
                inset="true"
                button
                href={sitemap["accountObjectsPath"]}
              >
                <ListItemIcon>
                  <ObjectsIcon />
                </ListItemIcon>
                <ListItemText>Objects</ListItemText>
              </ListItemLink>

              <ListItemLink
                inset="true"
                button
                href={sitemap["accountLocationsPath"]}
              >
                <>
                  <ListItemIcon>
                    <SchoolIcon />
                  </ListItemIcon>
                  <ListItemText>Schools</ListItemText>
                </>
              </ListItemLink>
            </Menu>
          )}
          <Divider />

          {canViewBankAccounts && (
            <ListItemLink href={sitemap["bankAccountsPath"]}>
              <Tooltip title="Bank Accounts" placement="right">
                <ListItemIcon>
                  <BankIcon
                    style={{color: modelColors["BankAccount"].menuColor}}
                  />
                </ListItemIcon>
              </Tooltip>
              <ListItemText>Banking</ListItemText>
            </ListItemLink>
          )}
          {canViewCreditCards && (
            <ListItemLink href={sitemap["creditCardsPath"]}>
              <Tooltip title="Credit Cards" placement="right">
                <ListItemIcon>
                  <CreditCardIcon
                    style={{color: modelColors["CreditCard"].menuColor}}
                  />
                </ListItemIcon>
              </Tooltip>
              <ListItemText>Credit Cards</ListItemText>
            </ListItemLink>
          )}
          {canViewCustomer && (
            <ListItemLink href={sitemap["customersPath"]}>
              <Tooltip title="Customers" placement="right">
                <ListItemIcon>
                  <CustomerIcon
                    style={{color: modelColors["Customer"].menuColor}}
                  />
                </ListItemIcon>
              </Tooltip>
              <ListItemText>Customers</ListItemText>
            </ListItemLink>
          )}
          {canViewEntries && (
            <ListItemLink href={sitemap["entriesPath"]}>
              <Tooltip title="Entries" placement="right">
                <ListItemIcon>
                  <EntryIcon style={{color: modelColors["Entry"].menuColor}} />
                </ListItemIcon>
              </Tooltip>
              <ListItemText>General Ledger</ListItemText>
            </ListItemLink>
          )}
          {canViewVendors && (
            <ListItemLink href={sitemap["vendorsPath"]}>
              <Tooltip title="Vendors" placement="right">
                <ListItemIcon>
                  <VendorIcon
                    style={{color: modelColors["Vendor"].menuColor}}
                  />
                </ListItemIcon>
              </Tooltip>
              <ListItemText>Vendors</ListItemText>
            </ListItemLink>
          )}
          <Divider />
          {canViewAdmin && (
            <Menu
              className={classes.submenu}
              renderToggle={({onClick, collapsed}) => (
                <Menu.Row>
                  <ListItemLink button href={sitemap["adminPath"]}>
                    <Tooltip title="Admin" placement="right">
                      <ListItemIcon>
                        <AdminIcon
                          style={{color: modelColors["Admin"].menuColor}}
                        />
                      </ListItemIcon>
                    </Tooltip>
                    <ListItemText>Admin</ListItemText>
                  </ListItemLink>
                  <Menu.Action button toggled={collapsed} onClick={onClick} />
                </Menu.Row>
              )}
            >
              <Divider />
              <ListItemLink button href="/admin">
                <ListItemIcon>
                  <AdminDashboardIcon />
                </ListItemIcon>
                <ListItemText>Admin Dashboard</ListItemText>
              </ListItemLink>
              <Divider />

              <ListItemLink button href={sitemap["adminOrganizationPath"]}>
                <ListItemIcon>
                  <OrgIcon />
                </ListItemIcon>
                <ListItemText>Organizations</ListItemText>
              </ListItemLink>

              <Divider />

              <ListItemLink button href={sitemap["adminUsersPath"]}>
                <ListItemIcon>
                  <UsersIcon />
                </ListItemIcon>
                <ListItemText>Users</ListItemText>
              </ListItemLink>
            </Menu>
          )}
          <Divider />
        </div>
      )) || (
        <div className={sidebarStyles.container}>
          <ListItemLink href="/signout">
            <Tooltip title="Logout" placement="right">
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
            </Tooltip>
            <ListItemText>Logout</ListItemText>
          </ListItemLink>
        </div>
      )}
      <Divider />
      <div className={classes.collapseBtnContainer}>
        {opened && !collapsed && (
          <Tooltip title="Close" placement="top">
            <SidebarTriggerComp
              className={cx(sidebarStyles.collapseBtn, classes.collapseBtn)}
            >
              <ChevronLeftIcon />
            </SidebarTriggerComp>
          </Tooltip>
        )}
        <Tooltip title="Minimize" placement="top">
          <CollapseBtnComp
            className={cx(sidebarStyles.collapseBtn, classes.collapseBtn)}
          >
            {collapsed ? <ChevronRightIcon /> : <FullBackIcon />}
          </CollapseBtnComp>
        </Tooltip>
      </div>
    </Sidebar>
  );
};

NavMenu.propTypes = {
  opened: PropTypes.bool,
  collapsed: PropTypes.bool,
  sidebarStyles: PropTypes.object,
};

const useStyles = makeStyles(() => {
  return {
    "@global": {
      "html > body > main.with-left-sidebar": {
        marginLeft: 226,
      },
      "html > body > main.with-left-sidebar.collapsed": {
        marginLeft: 64,
      },
    },
    root: {
      width: 226,
    },
    submenu: {
      background: "linear-gradient(to bottom, #f9f9f9, #eceff1)",

      "& a": {
        borderBottom: "#f5f5f5",
      },
    },
    li: {
      "&.report": {},
    },
    collapseBtnContainer: {
      display: "flex",
      justifyContent: "stretch",

      "& > button": {
        flexGrow: 1,
      },
    },
    collapseBtn: {
      background: "transparent",
    },
    menuItem: {
      "& svg": {
        filter: "saturate(0.33)",
      },
      "&:hover svg": {
        filter: "saturate(1)",
      },
    },
  };
});

export default NavMenu;

function ListItemLink(props) {
  const classes = useStyles();
  return (
    <ListItem button component="a" className={classes.menuItem} {...props} />
  );
}

class ListItemIcon extends React.Component {
  render() {
    return <ItemIcon {...this.props} />;
  }
}

/* Classes for Tooltip Refs  */
class CollapseBtnComp extends Component {
  render() {
    return <CollapseBtn {...this.props} component={Button} />;
  }
}

class SidebarTriggerComp extends Component {
  render() {
    return <SidebarTrigger {...this.props} component={Button} />;
  }
}
