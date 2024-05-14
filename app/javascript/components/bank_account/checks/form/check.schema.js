import * as yup from "yup";

import {
  entrySchema,
  entryItemSchema,
  entryItemSubmissionSchema,
} from "../../../entries/form/entry.schema";

export const checkTypes = ["ACH", "Wire", "Print", "Unknown"];

// Schema
//------------------------------------------------------------------------------
export const validationSchema = yup
  .object({
    id: yup.string().nullable(),
    aasmState: yup.string(),
    addressId: yup.string().nullable(),
    bankAccountId: yup.string().required("Bank Account must be provided"),
    number: yup.string().nullable(),
    checkType: yup
      .string()
      .oneOf(checkTypes, "Check Type must be: ACH, Wire, Print or Unknown")
      .nullable(),
    memo: yup
      .string()
      .nullable()
      .max(150, "Memo will not print if longer than 150 chars"),
    fileUrl: yup
      .string()
      .url()
      .nullable(),
    entry: entrySchema,
  })
  .test(
    "credit-bank-code",
    "Entry must credit the bank account's Object Code",
    function(values) {
      const {
        entry: {entryItems = []},
      } = values;
      const {accountObjectCode} = this.schema.meta();

      const credits = entryItems.filter(item => item.credit);
      const hasCredits = credits.some(item => item.amount > 0);
      const hasObjectCode = credits.some(item => item.objectCode);

      if (hasCredits && hasObjectCode) {
        return (
          /* At least one credit has the bank's account Object Code */
          credits.some(item => item.objectCode === accountObjectCode)
            ? true
            : this.createError({
                path: "entry.accountCode",
                message: `Entry must credit the bank account's Object Code [${accountObjectCode}]`,
              })
        );
      }
      return true;
    }
  );

export const submissionSchema = yup
  .object({
    aasmState: yup.string().strip(),
    entryAttributes: yup
      .object({
        entryItemsAttributes: yup.array(
          entryItemSchema.concat(entryItemSubmissionSchema).noUnknown()
        ),
      })
      .from("entryItems", "entryItemsAttributes"),
  })
  .from("entry", "entryAttributes");

export default validationSchema;
