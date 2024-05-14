import currency from "currency.js";
import groupBy from "lodash/groupBy";

// HELPER FUNCTIONS
//------------------------------------------------------------------------------

export const calculateCreditsBalance = (items = []) => {
  return items.reduce((accum, {credit} = {}) => accum.add(credit), currency(0));
};

export const calculateDebitsBalance = (items = []) => {
  return items.reduce((accum, {debit} = {}) => accum.add(debit), currency(0));
};

export const calculateBalance = (items = []) => {
  return currency(calculateCreditsBalance(items)).subtract(
    calculateDebitsBalance(items)
  );
};

addEventListener("message", ({data: {entryItems}}) => {
  const groups = {};
  const groupedItems = groupBy(
    entryItems,
    ({fundCode, resourceCode}) => `${fundCode}-${resourceCode}`
  );

  Object.entries(groupedItems).forEach(([name, items]) => {
    groups[name] = {
      credits: calculateCreditsBalance(items).format(true),
      debits: calculateDebitsBalance(items).format(true),
      balance: calculateBalance(items).format(true),
    };
  });

  const balanced = Object.values(groups).every(
    ({balance}) => balance === "$0.00"
  );

  postMessage({
    balanced,
    groupedItems: groups,
    total: {
      totalCredits: calculateCreditsBalance(entryItems).format(true),
      totalDebits: calculateDebitsBalance(entryItems).format(true),
      balance: calculateBalance(entryItems).format(true),
    },
  });
});
