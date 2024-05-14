import * as yup from "yup";

import {
  entrySchema,
  entryItemSchema,
  entryItemSubmissionSchema,
} from "../../../entries/form/entry.schema";

// Schema
//------------------------------------------------------------------------------
export const validationSchema = yup.object({
  id: yup.string().nullable(),
  aasmState: yup.string(),
  creditCardId: yup.string().required("Credit Card ID must be provided"),
  number: yup.string().nullable(),
  memo: yup
    .string()
    .max(150, "Memo will not print if longer than 150 chars")
    .nullable(),
  fileUrl: yup.string().url().nullable(),
  entry: entrySchema,
});

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
