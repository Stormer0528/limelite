import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardActionArea from "@material-ui/core/CardActionArea";

import Typography from "@material-ui/core/Typography";

import UploadIcon from "@shared/icons/batch_upload_icon";

const AuthCard = ({item: {__typename: authableType, editPath, createdAt}}) => {
  const classes = useStyles({authableType});

  // console.log("Authable Item:", item);

  return (
    <Card className={classes.root}>
      <CardHeader
        className={classes.cardHeader}
        avatar={
          <Avatar aria-label={authableType} className={classes.avatar}>
            {<UploadIcon />}
          </Avatar>
        }
        title={<Typography variant="h6">Batch Upload</Typography>}
        subheader={
          <p>
            <b>Date:</b>&nbsp;{createdAt}
          </p>
        }
      />
      <CardActionArea className={classes.cardActionArea}>
        <Button href={editPath} fullWidth variant="outlined" color="secondary">
          Review Upload
        </Button>
      </CardActionArea>
    </Card>
  );
};

AuthCard.propTypes = {
  refetch: PropTypes.func,
  item: PropTypes.shape({
    editPath: PropTypes.string,
    createdAt: PropTypes.string,
    __typename: PropTypes.string,
  }),
  authableType: PropTypes.string,
  authableId: PropTypes.string,
  classes: PropTypes.object,
};

const useStyles = makeStyles((theme) => {
  return {
    root: {
      width: "100%",
      border: "2px solid transparent",
      transition: "border-color .25s ease-out",
      padding: "8px",

      "&:hover": {
        cursor: "pointer",
        backgroundColor: "#fcfcfc",
        border: "2px solid #2196f3",
      },
    },
    cardHeader: {
      padding: 8,
    },
    cardActionArea: {
      justifyContent: "center",
    },
    subtitle: {
      display: "grid",
      gridTemplateRows: "1fr 1fr 1fr",
      minWidth: 150,
      width: "25vw",
    },
    avatar: ({authableType}) => {
      const {[authableType]: {gradient = ""} = {}} = theme.models || {};
      return {
        background: gradient,
      };
    },
  };
});

export default AuthCard;
