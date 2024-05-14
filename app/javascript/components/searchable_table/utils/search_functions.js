import {format} from "date-fns/esm";
import get from "lodash/get";

export const dateSearch = field => item => {
  const searchThing = field ? item[field] : item;
  return format(searchThing, "X");
};

export const amountSearch = field => item => {
  const searchThing = field ? item[field] : item;
  return Number(searchThing.replace(/[,$]/gi, ""));
};

export const textSearch = field => item => {
  const searchThing = field ? get(item, field) : item;
  return searchThing;
};

export const stateSearch = (field = "aasm_state") => item => {
  const searchThing = field ? item[field] : item;
  switch (searchThing) {
    case "draft":
      return 1;
    case "needs_approval":
      return 2;
    case "approved":
      return 3;
    case "needs_revision":
      return 4;
    case "printed":
      return 5;
    case "voided":
      return 6;
    default:
      return 7;
  }
};
