import * as yup from "yup";

import {
  entrySchema,
  entryItemSchema,
  entryItemSubmissionSchema,
} from "../../../entries/form/entry.schema";

// Schema
//------------------------------------------------------------------------------
export const validationSchema = yup
  .object({
    id: yup.string().nullable(),
    aasmState: yup.string(),
    bankAccountId: yup.string().required("Bank Account must be provided"),
    number: yup.string().nullable(),
    memo: yup.string().max(150, "Memo will not print if longer than 150 chars"),
    fileUrl: yup
      .string()
      .url()
      .nullable(),
    entry: entrySchema,
  })
  .test(
    "debit-bank-code",
    "Entry must debit the bank account's Object Code",
    function(values) {
      const {
        entry: {entryItems = []},
      } = values;
      const {accountObjectCode} = this.schema.meta();

      const debits = entryItems.filter(item => item.debit);
      const hasDebits = debits.some(item => item.amount > 0);
      const hasObjectCode = debits.some(item => item.objectCode);

      if (hasDebits && hasObjectCode) {
        return (
          /* At least one credit has the bank's account Object Code */
          debits.some(item => item.objectCode === accountObjectCode)
            ? true
            : this.createError({
                path: "entry.accountCode",
                message: `Entry must debit the bank account's Object Code [${accountObjectCode}]`,
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
