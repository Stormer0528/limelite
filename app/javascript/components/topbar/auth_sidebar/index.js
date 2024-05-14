import {createUpdateQuery} from "../../../utils";
import AuthCard from "./auth_card";
import AuthIconButton from "./auth_icon_button";
import BatchUploadCard from "./batch_upload_card";
import DenialCard from "./denial_card";
import PurchaseOrderCard from "./purchase_order_card";
import AUTHABLE_QUERY from "@graphql/queries/authable_items.gql";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import {withStyles} from "@material-ui/core/styles";
import AuthIcon from "@shared/icons/authorization_icon";
import PropTypes from "prop-types";
import {Fragment, useCallback, useEffect, useRef} from "react";
import {useQuery} from "react-apollo";

const AuthSidebar = ({
  open = false,
  handleOpen: setOpen = function () {},
  classes = {},
}) => {
  const handleOpen = useCallback(() => setOpen(true), [setOpen]);
  const handleClose = useCallback(() => setOpen(false), [setOpen]);

  const listRef = useRef();
  const cursorRef = useRef();

  const {
    fetchMore: fetchMoreRows,
    refetch = function () {},
    data: {
      authableItemConnection: {
        nodes: items = [],
        pageInfo: {endCursor} = {},
      } = {},
    } = {},
  } = useQuery(AUTHABLE_QUERY, {
    // pollInterval: 5 * 60 * 1000, // every 5 mins
    fetchPolicy: "network-only",
    variables: {first: 50},
  });

  cursorRef.current = endCursor;

  useEffect(() => {
    let node = null;
    let fetching = false;

    const onScroll = (evt) => {
      if (fetching || !cursorRef.current) return;

      if (node.scrollHeight - node.scrollTop <= node.clientHeight * 2) {
        fetching = true;
        fetchMoreRows({
          variables: {
            cursor: cursorRef.current,
          },
          updateQuery: createUpdateQuery({
            fieldName: "authableItemConnection",
            objectName: "nodes",
          }),
        }).then(() => {
          fetching = false;
        });
      }
    };

    if (listRef.current) {
      node = listRef.current.children[0];
      node.addEventListener("scroll", onScroll);
    }
    return () => {
      node.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <Fragment>
      <AuthIconButton
        {...{handleOpen, handleClose, open}}
        itemCount={items.length}
      />

      <Drawer
        open={open}
        onClose={handleClose}
        anchor="right"
        variant="persistent"
        classes={{
          paper: classes.drawerPaper,
        }}
        ref={listRef}
      >
        <div className={classes.drawerHeader}>
          <AuthIcon />
          <Typography variant="h6">Authorizations</Typography>
        </div>
        <Divider />
        <List>
          {items.map((item, i) => {
            const CardComponent = getCardComponent(item.__typename);
            return (
              <ListItem key={i} className={classes.listItem}>
                <CardComponent item={item} refetch={refetch} />
              </ListItem>
            );
          })}
        </List>
      </Drawer>
    </Fragment>
  );
};

AuthSidebar.propTypes = {
  open: PropTypes.bool,
  handleOpen: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

const styles = () => ({
  listItem: {
    padding: 8,
  },
  drawerHeader: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "12px",
    background: "linear-gradient(to bottom left, #344c82, #1aaeda)",
    color: "#fcfcfc",

    "& svg": {
      marginRight: ".75em",
      color: "#fcfcfc",
    },
  },
  drawerPaper: {
    top: 64,
    background:
      "linear-gradient(to top left, #eee, #f5f5f5 25vh, transparent) #f5f5f5",
  },
});

export default withStyles(styles)(AuthSidebar);

const getCardComponent = (typeName) => {
  switch (typeName) {
    case "PurchaseOrder":
      return PurchaseOrderCard;
    case "BatchUpload":
      return BatchUploadCard;
    case "DenialNotification":
      return DenialCard;
    default:
      return AuthCard;
  }
};
