import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/styles";

import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";

const EmptyMessage = ({
  newPath,
  itemName,
  pluralItemName = `${itemName}s`,
  icon: Icon,
}) => {
  const cl = useStyles();

  return (
    <div className={cl.root}>
      <Icon className={cl.statementIcon} />
      <h4 className={cl.header}>No {pluralItemName} Found</h4>
      <p className={cl.linkBtnContainer}>
        <Button
          startIcon={<AddIcon />}
          href={newPath}
          color="primary"
          className={cl.linkBtn}
        >
          {itemName}
        </Button>
      </p>
    </div>
  );
};

EmptyMessage.propTypes = {
  newPath: PropTypes.string,
  itemName: PropTypes.string,
  pluralItemName: PropTypes.string,
  icon: PropTypes.any,
};

const useStyles = makeStyles((theme) => {
  return {
    root: {
      transform: "translate(0, -50%)",
      position: "relative",
      top: "50%",
      zIndex: 100,
      textAlign: "center",
    },
    statementIcon: {
      position: "absolute",
      top: "50%",
      transform: "translate(-50%, -45%)",
      opacity: 0.05,
      height: "55vh",
      width: "55vw",
      userSelect: "none",
      zIndex: -1,
    },
    header: {
      fontWeight: 300,
      color: "#616161",
      userSelect: "none",
    },
    linkBtnContainer: {
      marginTop: theme.spacing(2),
      position: "relative",
      zIndex: 100,
    },
    linkBtn: {
      fontSize: "12px",
    },
  };
});

export default EmptyMessage;
