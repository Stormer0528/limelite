import PropTypes from "prop-types";
import {Fragment} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {format} from "date-fns/esm";
import {titleize} from "@utils";
import clsx from "clsx";
import StateIcon from "@shared/state_icon";

import HistoryIcon from "@material-ui/icons/History";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";

// Icons
import {
  TimelineRemove,
  TimelinePlus,
  TimelineClockOutline,
} from "mdi-material-ui";

import CloseIcon from "@material-ui/icons/CloseOutlined";

export default function VersionsSidebar({
  audits = [],
  handleClose = function () {},
}) {
  const classes = useStyles();
  const linkPrefix = window.location.pathname.replace("/edit", "");
  return (
    <Fragment>
      <h5 className={classes.header}>
        <HistoryIcon /> Revisions
        <IconButton onClick={handleClose} className={classes.closeBtn}>
          <CloseIcon />
        </IconButton>
      </h5>
      <List>
        {audits.map((audit, i) => {
          return (
            <ListItem
              button
              component="a"
              href={`${linkPrefix}/version/${audit.version}`}
              key={i}
              className={classes.item}
            >
              <ListItemIcon>
                <TimelineIcon action={audit.action} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <section className={classes.primaryRow}>
                    <div className="version">
                      <b>Version {audit.version}</b>
                    </div>
                    <div
                      className={clsx(
                        "status",
                        classes.status,
                        audit.aasmState
                      )}
                    >
                      <b>Status: </b>
                      <StateIcon aasmState={audit.aasmState} />
                      <span className={classes[audit.aasmState]}>
                        {titleize(audit.aasmState)}
                      </span>
                    </div>
                  </section>
                }
                secondary={<SecondaryRow {...audit} />}
              />
            </ListItem>
          );
        })}
      </List>
    </Fragment>
  );
}

const useStyles = makeStyles((theme) => ({
  header: {
    borderBottom: "1px solid #ccc",
    background: "linear-gradient(-45deg, #607D8B, #305069)",
    margin: 0,
    padding: "0.5em 1rem",
    display: "flex",
    alignItems: "center",
    color: "#fff",

    "& > svg": {
      marginRight: "0.5em",
    },
  },
  item: {
    borderBottom: "1px solid #eee",
  },
  closeBtn: {
    color: "#fff",
    position: "absolute",
    right: "1rem",
    padding: 6,
    opacity: ".75",
  },
  primaryRow: {
    display: "grid",
    gridTemplateColumns: "max-content 1fr",
    gridColumnGap: 16,
    alignItems: "baseline",
  },
  status: {
    display: "flex",
    alignItems: "center",

    "& > b": {
      fontWeight: 400,
      color: "#000000DE",
    },
    "& > svg": {
      marginLeft: "0.25em",
      marginRight: "0.125em",
    },

    "&.draft": {
      color: "#2196f3",
    },
    "&.approved": {
      color: "#4caf50",
    },
    "&.needs_revision": {
      color: "#ffb300",
    },

    "&.reversed": {
      color: "#f44336",
    },
  },
}));

VersionsSidebar.propTypes = {
  statement_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  audits: PropTypes.arrayOf(PropTypes.object),
  handleClose: PropTypes.func.isRequired,
};

function SecondaryRow({auditableType = "", createdAt, action, user}) {
  const {fullName, email} = user || {};
  return (
    <p>
      {user && (
        <Fragment>
          <b>{fullName}</b> [{email}]
        </Fragment>
      )}
      <i>{action}d</i> {auditableType} on <span />
      {format(createdAt, "MM/dd/yyyy HH:mm:ss")}
    </p>
  );
}

SecondaryRow.propTypes = {
  aasmState: PropTypes.string,
  auditableType: PropTypes.string,
  version: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  createdAt: PropTypes.string,
  action: PropTypes.string,
  user: PropTypes.shape({
    fullName: PropTypes.string,
    email: PropTypes.string,
  }),
};

function TimelineIcon({action}) {
  switch (action) {
    case "create":
      return <TimelinePlus />;
    case "update":
      return <TimelineClockOutline />;
    case "destroy":
      return <TimelineRemove />;
    default:
      return <TimelineClockOutline />;
  }
}

TimelineIcon.propTypes = {
  action: PropTypes.string,
};
