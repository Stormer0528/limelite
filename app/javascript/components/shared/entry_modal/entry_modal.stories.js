import {withKnobs, boolean} from "@storybook/addon-knobs";
import withApollo from "../stories/apollo_decorator";
import withTheme, {CSSBaseline} from "../stories/theme_decorator";
import EntryModal from "../entry_modal/entry_modal";

export default {
  component: EntryModal,
  title: "Shared/EntryModal",
  decorators: [withKnobs, withTheme, withApollo, CSSBaseline],
};

export const ModalWithCheck = () => {
  const loading = boolean("Loading", false);
  const open = boolean("Open", true);

  return <EntryModal {...{open, loading, entry: check}} />;
};

export const ModalWithDeposit = () => {
  const loading = boolean("Loading", false);
  const open = boolean("Open", true);

  return <EntryModal {...{open, loading, entry: deposit}} />;
};

export const ModalWithInvoice = () => {
  const loading = boolean("Loading", false);
  const open = boolean("Open", true);

  return <EntryModal {...{open, loading, entry: invoice}} />;
};

const check = {
  id: 38186,
  entryType: "Payment",
  date: "2019-11-05T00:00:00-08:00",
  totalDebits: "$-100.00",
  totalCredits: "$100.00",
  path: "/path/to/entry",
  journalablePath: "/path/to/payment",
  journalableType: "Payment",
  payableName: "City of Yuba City - 003904",
  payablePath: "/vendors/city-of-yuba-city",
  payableType: "Vendor",
  entryItems: [
    {
      id: 124822,
      type: "Debit",
      memo: null,
      date: "2019-11-05",
      accountName: "Accounts Payable (Current Liabilities)\t",
      accountNumber: "1182-0000-0-0000-0000-9500-00",
      accountDisplayName:
        "1182-0000-0-0000-0000-9500-00 - Accounts Payable (Current Liabilities)\t",
      positiveAmount: "$100.00",
      payable: {
        name: "City of Yuba City",
        path: "/vendors/city-of-yuba-city",
        __typename: "Vendor",
      },
      payableType: "Vendor",
      __typename: "EntryItem",
    },
    {
      id: 124823,
      type: "Credit",
      memo: null,
      date: "2019-11-05",
      accountName: "Cash in Bank(s)",
      accountNumber: "1182-0000-0-0000-0000-9120-00",
      accountDisplayName: "1182-0000-0-0000-0000-9120-00 - Cash in Bank(s)",
      positiveAmount: "$100.00",
      payable: {
        name: "City of Yuba City",
        path: "/vendors/city-of-yuba-city",
        __typename: "Vendor",
      },
      payableType: "Vendor",
      __typename: "EntryItem",
    },
  ],
  __typename: "Entry",
  creditCardItems: [],
  bankAccountItems: [
    {
      type: "Check",
      path: "/bank_accounts/main-checking-account/checks/22151",
      number: "13184",
      permissions: {
        show: true,
      },
    },
  ],
};

const deposit = {
  id: 43651,
  entryType: "Revenue",
  date: "2020-02-28T00:00:00-08:00",
  totalDebits: "$-1,230.00",
  totalCredits: "$1,230.00",
  path: "/path/to/entry",
  journalablePath: null,
  journalableType: null,
  payableName: null,
  payablePath: null,
  payableType: null,
  entryItems: [
    {
      id: 145223,
      type: "Debit",
      memo: "MEM`",
      date: "2020-02-28",
      accountName: "Cash in Bank(s) - Pacific Western Bank",
      accountNumber: "1182-0000-0-0000-0000-9121-00",
      accountDisplayName:
        "1182-0000-0-0000-0000-9121-00 - Cash in Bank(s) - Pacific Western Bank",
      positiveAmount: "$1,230.00",
      payable: {
        name: " Barbie   Baio ",
        path: "/path/to/vendor",
        __typename: "Vendor",
      },
      payableType: "Vendor",
      __typename: "EntryItem",
    },
    {
      id: 145224,
      type: "Credit",
      memo: "Memo Credit",
      date: "2020-02-28",
      accountName: "Accounts Payable (Current Liabilities)",
      accountNumber: "1182-0000-0-0000-0000-9500-00",
      accountDisplayName:
        "1182-0000-0-0000-0000-9500-00 - Accounts Payable (Current Liabilities)\t",
      positiveAmount: "$1,230.00",
      payable: {
        name: " Barbie   Baio ",
        path: "/path/to/vendor",
        __typename: "Vendor",
      },
      payableType: "Vendor",
      __typename: "EntryItem",
    },
  ],
  __typename: "Entry",
  creditCardItems: [],
  bankAccountItems: [
    {
      type: "Deposit",
      path: "/path/to/bank_account",
      number: "DEPOSIT",
      permissions: {
        show: true,
      },
    },
  ],
};

const invoice = {
  id: 83,
  entryType: "Accounts Payable",
  date: "2018-07-09T00:00:00-07:00",
  totalDebits: "$-4,400.00",
  totalCredits: "$4,400.00",
  path: "/path/to/entry",
  journalablePath: "/path/to/invoice",
  journalableType: "Invoice",
  payableName: "Royal Oak Design - 000162",
  payablePath: "/path/to/vendor",
  payableType: "Vendor",
  entryItems: [
    {
      id: 168,
      type: "Debit",
      memo: "",
      date: "2018-07-09",
      accountName: "Work in Progress",
      accountNumber: "1118-0000-0-0000-0000-9450-00",
      accountDisplayName: "1118-0000-0-0000-0000-9450-00 - Work in Progress",
      positiveAmount: "$4,400.00",
      payable: {
        name: "Royal Oak Design",
        path: "/path/to/vendor",
        __typename: "Vendor",
      },
      payableType: "Vendor",
      __typename: "EntryItem",
    },
    {
      id: 169,
      type: "Credit",
      memo: "",
      date: "2018-07-09",
      accountName: "Accounts Payable (Current Liabilities)",
      accountNumber: "1118-0000-0-0000-0000-9500-00",
      accountDisplayName:
        "1118-0000-0-0000-0000-9500-00 - Accounts Payable (Current Liabilities)",
      positiveAmount: "$4,400.00",
      payable: {
        name: "Royal Oak Design",
        path: "/path/to/vendor",
        __typename: "Vendor",
      },
      payableType: "Vendor",
      __typename: "EntryItem",
    },
  ],
  __typename: "Entry",
  creditCardItems: [],
  bankAccountItems: [],
};
