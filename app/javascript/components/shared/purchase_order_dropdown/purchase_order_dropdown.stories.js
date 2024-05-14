import PODropdown from "./dropdown";

import withPropsCombinations from "react-storybook-addon-props-combinations";
import {storiesOf} from "@storybook/react";

// DATA
//-----------------------------------------------
const purchaseOrders = [
  {
    id: 1,
    number: "PO-1212553",
    total: "$100.12",
    dateNeeded: "2020-03-24 19:44:35 -0700",
    date: "2020-03-24 19:44:35 -0700",
  },
  {
    id: 2,
    number: "PO-1111",
    total: 100,
    displayName: "PO-1111 - aada",
    dateNeeded: "2020-03-24 19:44:35 -0700",
    date: "2020-03-24 19:44:35 -0700",
  },
  {
    id: 3,
    number: "PO-1212553",
    dateNeeded: null,
    date: "2020-03-24 19:44:35 -0700",
  },
  {
    id: 4,
    number: "PO-1212553",
    dateNeeded: "2020-03-24 19:44:35 -0700",
    date: null,
  },
];

storiesOf("Shared/Purchase Order Dropdown", PODropdown).add(
  "Attribute Permutations",
  withPropsCombinations(PODropdown, {
    loading: [true, false],
    disabled: [true, false],
    readOnly: [true, false],
    purchaseOrders: [purchaseOrders],
  })
);
