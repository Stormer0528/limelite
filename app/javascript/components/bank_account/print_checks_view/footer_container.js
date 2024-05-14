// import PropTypes from "prop-types";
import {useFormikContext} from "formik";
import currency from "currency.js";
import {useCurrentRoute} from "react-navi";

import Footer from "./footer";

const FooterContainer = () => {
  const context = useFormikContext();
  const {
    isValid,
    values: {checkedItems},
  } = context;

  const items = Object.values(checkedItems);
  const itemCount = items.length;
  const total = calculateTotal(items).format(true);
  const {
    data: {
      bank_account: {balance},
    },
  } = useCurrentRoute();

  return <Footer {...{total, items, itemCount, balance, isValid}} />;
};

FooterContainer.propTypes = {};

export default FooterContainer;

// HELPER FUNCTIONS
//------------------------------------------------------------------------------
export const calculateTotal = (items = []) => {
  return items.reduce((accum, {amount} = {}) => accum.add(amount), currency(0));
};
