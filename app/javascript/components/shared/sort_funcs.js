import isEmpty from "lodash/isEmpty";
import isNil from "lodash/isNil";
import sortBy from "lodash/sortBy";
import trim from "lodash/trim";

export function sortItems(items = [], {direction, name}) {
  if (isEmpty(name) || isNil(name)) {
    return items;
  }

  let newItems = [];
  // Special Search options
  // Note: must set newItems
  switch (name) {
    case "amount":
      newItems = sortBy(items, ({amount}) =>
        Number(amount.replace(/[,$]/gi, ""))
      );
      break;
    case "name":
      newItems = sortBy(items, ({payee, vendor}) =>
        isEmpty(payee) ? vendor : payee
      );
      break;
    case "date":
      newItems = sortBy(items, ({date}) => new Date(date).toISOString());
      break;
    case "number":
    case "check#":
      // Sort by number, then date
      newItems = sortBy(items, [
        ({number = ""}) => {
          if (number === "") {
            return Infinity;
          }
          return Number((number || "").replace(/[,$a-zA-z]/gi, ""));
        },
        ({date}) => new Date(date).toISOString(),
      ]);
      break;
    default:
      newItems = sortBy(items, ({[name]: field = ""}) => trim(field));
  }

  return direction === "desc" ? newItems : newItems.reverse();
}
