import {object, array, string, number} from "yup";

// Schema
//------------------------------------------------------------------------------
export const validationSchema = object({
  id: string().nullable(),
  vendorId: string().nullable(),
  invoiceId: string().nullable(),
  purchaseOrderItems: array(
    object({
      // id: string().nullable(),
      order: number().nullable(),
      priceInCents: number().nullable(),
      quantity: number().positive().nullable(),
      description: string().nullable(),
    })
  ),
  number: string().nullable(),
  date: string().nullable(),
  dateNeeded: string().nullable(),
  addressId: string().nullable(),
  vendorAddressId: string().nullable(),
  requestedById: string().nullable(),
  requestedForId: string().nullable(),
  buyer: string().nullable(),
  requisitionNumber: string().nullable(),
  referenceNumber: string().nullable(),
  quoteDate: string().nullable(),
  proposalDate: string().nullable(),
  quoteNumber: string().nullable(),
  proposalNumber: string().nullable(),
  paymentTerms: string().nullable(),
  taxAmountInCents: number().nullable(),
  shippingAmountInCents: number().nullable(),
  fileUrl: string().nullable(),
});

export const submissionSchema = object({
  aasmState: string().strip(),
}).from("purchaseOrderItems", "purchaseOrderItemsAttributes");

export default validationSchema;
