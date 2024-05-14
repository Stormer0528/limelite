import currency from "currency.js";
import * as yup from "yup";

export const entryItemSchema = yup.object().shape({
  id: yup.number().integer().positive().nullable(),
  type: yup.string().oneOf(["Credit", "Debit"]).required(),
  memo: yup.string().nullable(),
  amount: yup.number().required("Amount is required"),
  payableId: yup.number().integer().positive().nullable(),
  payableType: yup.string().oneOf(["Vendor", "Customer"]).nullable(),
  fundCode: yup.number().nullable(),
  functionCode: yup.number().nullable(),
  goalCode: yup.number().nullable(),
  locationCode: yup.number().nullable(),
  objectCode: yup.number().nullable(),
  resourceCode: yup.number().nullable(),
  yearCode: yup.number().nullable(),
});

export const entrySchema = yup.object({
  id: yup.number().integer().positive().nullable(),
  date: yup.string().label("Entry date").required(),
  fileUrl: yup.string().label("Backup File Url"),
  entryType: yup
    .string()
    .oneOf(
      [
        "Transaction",
        "Journal Entry",
        "Payroll",
        "Accounts Payable",
        "Accounts Receivable",
        "Beginning Balance",
        "Payment",
        "Revenue",
      ],
      "Entry Type must be one of: Transaction, Journal Entry, Payroll, Accounts Payable, Accounts Receivable, Beginning Balance, Payment, Revenue"
    )
    .required(),
  backupFileUrl: yup.string().nullable(),
  entryItems: yup
    .array()
    .test(
      "is-balanced",
      "Entry must be balanced",
      (items) => calculateBalance(items).value === 0
    ),
});

export default entrySchema;

// Submission Schema
//------------------------------------------------------------------------------
// function for casting/stripping values for form submission

export const entryItemSubmissionSchema = yup.object({
  accountId: yup.number().required(),
  fundCode: yup.number().strip(),
  functionCode: yup.number().strip(),
  goalCode: yup.number().strip(),
  locationCode: yup.number().strip(),
  objectCode: yup.number().strip(),
  resourceCode: yup.number().strip(),
  yearCode: yup.number().strip(),
});

export const calculateBalance = (items = []) => {
  return currency(calculateCreditsBalance(items)).subtract(
    calculateDebitsBalance(items)
  );
};

export const calculateCreditsBalance = (items = []) => {
  return items.reduce((accum, {credit} = {}) => accum.add(credit), currency(0));
};
export const calculateDebitsBalance = (items = []) => {
  return items.reduce((accum, {debit} = {}) => accum.add(debit), currency(0));
};
