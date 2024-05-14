import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

const ValidHeader = ({name, readOnly}) => (
  <Grid
    item
    style={{
      gridColumnStart: 1,
      gridColumnEnd: readOnly ? -1 : -2,
      gridRow: 1,
      background: "#F5F5F5",
      paddingLeft: "8px",
      borderBottom: "2px solid #fff",
      zIndex: 2,

      ".disabled.readonly &": {
        gridColumnEnd: -1,
      },
    }}
  >
    <Typography variant="subtitle1">
      <b>{name}</b>
    </Typography>
  </Grid>
);

ValidHeader.propTypes = {
  name: PropTypes.string,
  readOnly: PropTypes.bool,
};

const styles = theme => ({});

export default withStyles(styles)(ValidHeader);
