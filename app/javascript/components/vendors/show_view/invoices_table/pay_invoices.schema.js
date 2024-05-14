import * as yup from "yup";

const validationSchema = yup.object({
  vendorId: yup.string().required(),
  cashAccountId: yup.string().required(),
  addressId: yup.string(),
});

export default validationSchema;
