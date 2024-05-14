import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

import Form from "../form";
import RequestSection from "./request_section";
import QuoteProposalFields from "../form/quote_proposal_fields";
import ItemsSection from "./items_section";
import TotalsSection from "./totals_section";

const View = ({vendor = {}, purchaseOrder = {}, classes = {}}) => {
  return (
    <Card className={classes.root}>
      <CardContent className={classes.content}>
        <Form
          {...{vendor, purchaseOrder}}
          disabled
          readOnly
          hideSubmissionBar
          hideRequestSection
          hideQuoteSection
          hideInvoiceBtn
          hideItemsSection
          hideTotalsSection
        />
        <RequestSection {...{purchaseOrder}} />
        <QuoteProposalFields
          readOnly
          handleChange={function () {}}
          classes={classes}
          {...{
            ...purchaseOrder,
          }}
        />
        <ItemsSection {...{purchaseOrder}} />
        <TotalsSection {...{purchaseOrder}} />
      </CardContent>
    </Card>
  );
};

View.propTypes = {
  vendor: PropTypes.object,
  purchaseOrder: PropTypes.object,
  classes: PropTypes.object.isRequired,
};

const styles = () => ({
  root: {},
  content: {},
});

export default withStyles(styles)(View);
