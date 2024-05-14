import styled from "styled-components";
import TextField from "@material-ui/core/TextField";

const StyledTextField = styled(TextField)`
  label,
  &.MuiFormControl-root[readonly] label.Mui-disabled {
    color: #59727e;
    font-weight: 500;
  }

  &.Mui-disabled.Mui-input {
    color: "#333";
  }

  &.MuiFormControl-root[readonly] .MuiFormHelperText-root.Mui-disabled {
    color: #546e7a;
  }

  &.MuiFormControl-root[readonly] input.MuiInputBase-input.Mui-disabled {
    color: #333;
    padding: 10px 14px !important;
  }

  .MuiOutlinedInput-root {
    input {
      padding: 10px 14px !important;
    }

    &.Mui-disabled input {
      color: #333;
    }
  }

  label.MuiInputLabel-outlined {
    transform: translate(14px, 12px) scale(1);

    &.MuiInputLabel-shrink {
      color: #59727e !important;
      transform: translate(14px, -6px) scale(0.75);
    }
  }

  /* Filled Inputs */
  &.MuiTextField-root {
    .MuiFilledInput-root {
      border-radius: 4px;
    }

    .MuiFilledInput-input,
    .MuiFilledInput-input.Mui-disabled {
      padding: 12px 14px 8px !important;
    }

    .MuiFilledInput-underline:before,
    .MuiFilledInput-underline.Mui-disabled:before {
      border-bottom: none;
    }

    label.MuiInputLabel-filled {
      transform: translate(14px, 12px) scale(1);

      &.MuiInputLabel-shrink {
        transform: translate(14px, 4px) scale(0.75);
      }
    }

    &[readonly] input.MuiInputBase-input.Mui-disabled {
      padding: 12px 14px 8px !important;
    }

    /* Full Width Inputs */
    &.MuiFormControl-fullWidth {
      textarea,
      textarea.Mui-disabled {
        padding: 12px 14px 8px !important;
        color: #333;
      }
    }
  }
`;

export default StyledTextField;
