import filter from "lodash/filter";
import {formatNumber} from "humanize-plus";

// Helper Functions
//------------------------------------------------------------------------------
export function calcReconciledBalance(items = {}) {
  const totalCents = Object.values(items).reduce((total, item) => {
    const {type, amountInCents} = item;
    if (type === "deposit") {
      return total + parseInt(amountInCents);
    }
    return total - parseInt(amountInCents);
  }, 0);

  return (totalCents / 100).toFixed(2);
}

export function calcRemainingBalance(ending_balance, remaining_balance) {
  const total = parseFloat(ending_balance) - parseFloat(remaining_balance);
  return `$${formatNumber(total, 2)}`;
}

export function calcCreditBalance({items = [], type = "credit"}) {
  const total = items.reduce((total, item) => {
    const {
      amountInCents = 0,
      type: itemType,
      isFromAccountItem,
      isToAccountItem,
    } = item;
    if (type === "credit") {
      return itemType === "Deposit" || isToAccountItem
        ? total + parseInt(amountInCents)
        : total;
    }

    return itemType === "Check" || isFromAccountItem
      ? total + parseInt(amountInCents)
      : total;
  }, 0);

  return total;
}

export function filterByStringAttribute(items = [], attribute, value) {
  return filter(items, {[attribute]: value});
}

export function filterByStringAttributeArray(
  items = [],
  attribute,
  values = []
) {
  return filter(items, item => values.includes(item[attribute]));
}

export function objectifyArray(items = []) {
  return items.reduce((result, item) => {
    result[item.id] = item;
    return result;
  }, {});
}
