import PropTypes from "prop-types";
import {useState} from "react";
import {withStyles} from "@material-ui/core/styles";
import {titleCase} from "humanize-plus";
import decamelize from "decamelize";

import {renderClassIcon} from "../auth_card";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";

import ApprovalFooter from "./approval_footer";
import Preview from "./preview";
import ValidationErrors from "@shared/validation_errors";

const AuthModal = ({
  open,
  item = {},
  handleClose,
  classes = {},
  refetch = function () {},
}) => {
  const [validationErrors, setValidationErrors] = useState([]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="xl"
      aria-labelledby="auth-dialog-title"
    >
      <DialogTitle id="auth-dialog-title" className={classes.title}>
        <span className={classes.titleContainer}>
          {renderClassIcon(item.type)} {titleize(item.type)}
        </span>
        <Breadcrumbs
          separator="|"
          arial-label="Breadcrumb"
          className={classes.navlinks}
        >
          <Link
            component={Button}
            prefetch="prefetch"
            href={item.path}
            className={classes.linkButton}
          >
            View
          </Link>
          <Link
            component={Button}
            prefetch="prefetch"
            href={item.editPath}
            className={classes.linkButton}
          >
            Edit
          </Link>
        </Breadcrumbs>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <ValidationErrors errors={validationErrors} />
      <DialogContent>
        <Preview {...{...item, authableType: item.type}} />
      </DialogContent>

      <ApprovalFooter
        {...item}
        {...{
          setValidationErrors,
          handleClose,
          refetch,
        }}
      />
    </Dialog>
  );
};

AuthModal.propTypes = {
  refetch: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool,
  item: PropTypes.object,
  handleClose: PropTypes.func,
};

const styles = () => ({
  title: {
    "& > h2": {
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
    },
  },
  titleContainer: {
    display: "flex",
    alignItems: "center",
    flexGrow: 1,
  },
  linkButton: {
    display: "flex",
    color: "#424242",

    "&:hover": {
      textDecoration: "none",
      backgroundColor: "#607d8b2b",
    },
  },
  navlinks: {
    display: "flex",
    justifyContent: "flex-end",
    borderBottom: "none",
    height: "32px",
    lineHeight: "32px",
    "& > ol": {
      justifyContent: "flex-end",
    },
  },
});

export default withStyles(styles)(AuthModal);

const titleize = (str = "") => titleCase(decamelize(str).replace(/[-_]/g, " "));
