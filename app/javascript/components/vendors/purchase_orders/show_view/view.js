import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

import Form from "../form";

const View = ({vendor = {}, purchaseOrder = {}, classes = {}}) => {
  return (
    <Card className={classes.root}>
      <CardContent className={classes.content}>
        <Form
          {...{
            vendor,
            purchaseOrder,
            hideSubmissionBar: true,
            disabled: true,
            readOnly: true,
          }}
        />
      </CardContent>
    </Card>
  );
};

View.propTypes = {
  vendor: PropTypes.object,
  purchaseOrder: PropTypes.object,
  classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
  root: {},
  content: {},
});

export default withStyles(styles)(View);
