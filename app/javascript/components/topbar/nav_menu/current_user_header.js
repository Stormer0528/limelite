import PropTypes from "prop-types";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";

import {makeStyles} from "@material-ui/core/styles";
import {useQuery} from "react-apollo";

import CURRENT_USER_QUERY from "../../../graphql/queries/current_user.gql";

const CurrentUserHeader = ({collapsed}) => {
  const cl = useStyles(collapsed);
  const {
    data: {currentUser: {fullName, email, avatarUrl, initials} = {}} = {},
  } = useQuery(CURRENT_USER_QUERY);

  return (
    <div className={cl.root}>
      <Avatar component="a" className={cl.avatar} href="/user">
        {avatarUrl || initials}
      </Avatar>
      <div className={cl.textContainer}>
        <Typography variant={"h6"} noWrap>
          <a href="/user" className={cl.nameText}>
            {fullName}
          </a>
        </Typography>
        <Typography className={cl.emailText} noWrap gutterBottom>
          {email}
        </Typography>
      </div>
    </div>
  );
};

CurrentUserHeader.propTypes = {
  collapsed: PropTypes.bool,
};

const useStyles = makeStyles((theme) => {
  return {
    root: {
      display: "grid",
      borderBottom: "1px solid #e0e0e0",
      gridTemplateColumns: "64px 1fr",
      gridColumnGap: "0.65rem",
      transition: "0.3s",
      height: 60,
      padding: "4px 0 0",
      background: "linear-gradient(to bottom, #f0f0f0, #fcfcfc)",
    },
    emailText: {
      color: theme.palette.secondary.main,
    },
    nameText: {
      color: theme.palette.primary.main,
    },
    avatar: {
      textDecoration: "none",
      gridRowStart: 1,
      gridRowEnd: 2,
      alignSelf: "center",
      justifySelf: "center",
      width: 48,
      height: 48,
      transition: "0.3s",
      background: `linear-gradient(to top left, ${theme.palette.secondary.light}, ${theme.palette.secondary.dark})`,
    },
    textContainer: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },
  };
});

export default CurrentUserHeader;
