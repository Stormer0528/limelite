import {makeStyles} from "@material-ui/core/styles";
import PropTypes from "prop-types";
import clsx from "clsx";

import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Typography from "@material-ui/core/Typography";

const AuthProgress = ({
  authorizations = [],
  authorizationPath = [],
  authorizationPathIndex = 0,
}) => {
  const cl = useStyles();
  return (
    <Stepper activeStep={authorizationPathIndex} className={cl.root}>
      {authorizationPath.map(({name, id}, index) => {
        const auth = authorizations
          .filter(({groupId}) => groupId === id)
          .reverse()[0];
        const {date, userName, action} = auth || {};

        return (
          <Step key={index} completed={!!action}>
            <StepLabel
              error={action === "Deny"}
              completed={!!action}
              classes={{error: cl.error, completed: cl.success}}
              StepIconProps={{
                completed: !!action,
                classes: {
                  error: cl.error,
                  completed: cl.success,
                },
              }}
              disabled={index > authorizationPathIndex}
              optional={
                userName && (
                  <div className={cl.optionalText}>
                    <Typography variant="subtitle2">{userName}</Typography>
                    <Typography variant="caption">
                      {new Date(date).toLocaleDateString()}
                    </Typography>
                  </div>
                )
              }
            >
              <Typography
                variant="subtitle1"
                className={clsx(cl.groupName, {[cl.error]: action === "Deny"})}
              >
                {name}
              </Typography>
            </StepLabel>
          </Step>
        );
      })}
    </Stepper>
  );
};
AuthProgress.propTypes = {
  authorizationPathIndex: PropTypes.number,
  authorizations: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string,
      userName: PropTypes.string,
      action: PropTypes.string,
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),
  authorizationPath: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      idid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),
};

const useStyles = makeStyles(() => ({
  root: {
    background: "transparent",
    padding: "0 8px",
  },
  optionalText: {
    display: "grid",
    textAlign: "left",
  },
  error: {
    color: "#ff9800",
    "&$error": {
      color: "#ff9800",
    },
  },
  groupName: {
    fontWeight: "900",
    fontSize: "1rem",
    color: "#424242",
  },
  success: {
    color: "#558b2f !important",
  },
}));

export default AuthProgress;
