import {makeStyles} from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";

function ProgressBar() {
  const classes = useStyles();
  return (
    <LinearProgress
      classes={{
        colorPrimary: classes.progressBar,
      }}
      className={classes.progress}
    />
  );
}

const useStyles = makeStyles(() => {
  return {
    progress: {
      height: "2px",
    },
    progressBar: {
      background: "#43A047",
    },
  };
});

export default ProgressBar;
