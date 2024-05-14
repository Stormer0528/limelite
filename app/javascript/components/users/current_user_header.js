import PropTypes from "prop-types";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";

import {makeStyles} from "@material-ui/core/styles";
import {useQuery} from "react-apollo";

import CURRENT_USER_QUERY from "../../graphql/queries/current_user.gql";

const CurrentUserHeader = ({collapsed}) => {
  const cl = useStyles(collapsed);
  const {
    data: {currentUser: {url, fullName, email, avatarUrl, initials} = {}} = {},
  } = useQuery(CURRENT_USER_QUERY);

  return (
    <div
      className={cl.root}
      style={{padding: collapsed ? 8 : 16, transition: "0.3s"}}
    >
      <Avatar
        component="a"
        className={cl.avatar}
        style={{
          width: collapsed ? 48 : 60,
          height: collapsed ? 48 : 60,
          transition: "0.3s",
        }}
        href={url}
      >
        {avatarUrl || initials}
      </Avatar>
      <div className={cl.textContainer}>
        <Typography variant={"h6"} noWrap>
          {fullName}
        </Typography>
        <Typography color={"textSecondary"} noWrap gutterBottom>
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
    },
    avatar: {
      textDecoration: "none",
      gridRowStart: "1",
      gridRowEnd: "2",
    },
    textContainer: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },
  };
});

export default CurrentUserHeader;
