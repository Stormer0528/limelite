import {createTheme, responsiveFontSizes} from "@material-ui/core/styles";
import {red} from "@material-ui/core/colors";

const palette = {
  primary: {main: "#26383C"},
  secondary: {main: "#70A91E"},
  error: red,
  draft: {main: "#2196f3"},
  approved: {main: "#4caf50"},
  printed: {main: "#1B5E20"},
  needsRevision: {main: "#ffb300"},
  reversed: {main: "#f44336"},
  voided: {main: "#f44336"},
};

const theme = createTheme(
  {palette, themeName: "LimeliteDS"},
  {
    states: {
      draft: "#2196f3",
      approved: "#4caf50",
      printed: "#1B5E20",
      needs_revision: "#ffb300",
      needsRevision: "#ffb300",
      needs_approval: "#ffb300",
      needsApproval: "#ffb300",
      reversed: "#f44336",
      voided: "#f44336",
    },
    models: {
      Account: {
        textColor: "#e8f5e9",
        backgroundColor: "#1cb5e0",
        gradient: "linear-gradient(to bottom right, #1cb5e0 0%, #000851 100%)",
        menuColor: "#106da5",
      },
      Admin: {
        textColor: "#e8eaf6",
        backgroundColor: "#943729",
        gradient:
          "linear-gradient(to bottom right, #485a2dbf 0%, #3dddf729), linear-gradient(to top, #521a04 0%, #da0505 100%)",
        menuColor: "#8f3728",
      },
      BankAccount: {
        color: "#94bc5e",
        textColor: "#f1f8e9",
        backgroundColor: "#008552",
        gradient: "linear-gradient(to bottom right, #9ebd13 0%, #008552 140%)",
        menuColor: "#68aa28",
      },
      Check: {
        color: "#94bc5e",
        textColor: "#f1f8e9",
        backgroundColor: "#008552",
        gradient: "linear-gradient(to bottom right, #9ebd13 0%, #008552 140%)",
        menuColor: "#68aa28",
      },
      Deposit: {
        color: "#94bc5e",
        textColor: "#f1f8e9",
        backgroundColor: "#008552",
        gradient: "linear-gradient(to bottom right, #9ebd13 0%, #008552 140%)",
        menuColor: "#68aa28",
      },
      CreditCard: {
        textColor: "#fbe9e7",
        backgroundColor: "#ffee57",
        gradient: "linear-gradient(to top left, #ffee57 0%, #9abb14 100%)",
        menuColor: "#c7ce36",
      },
      Customer: {
        color: "#3689ea",
        textColor: "#fff",
        backgroundColor: "#00d2ff",
        gradient: "linear-gradient(to bottom right, #00d2ff 0%, #3a47d5 100%)",
        menuColor: "#3689ea",
      },
      Entry: {
        menuColor: "#66892c",
        newEntry: "#66892c",
        gradient: "linear-gradient(to bottom right, #9ebd13 0%, #ffee57 140%)",
      },
      Invoice: {
        textColor: "#fff",
        backgroundColor: "#f7d118",
        gradient: "linear-gradient(to bottom right, #f7d118 0%, #c34e4e 100%)",
      },
      Organization: {
        menuColor: "#2d4577",
      },
      PurchaseOrder: {
        textColor: "#fff",
        backgroundColor: "#4b6cb7",
        gradient: "linear-gradient(to bottom right, #4b6cb7 0%, #182848 100%)",
      },
      Report: {
        color: "#e39a7e",
        textColor: "#fff",
        backgroundColor: "#d7715d",
        gradient: "linear-gradient(to bottom right, #00d2ff 0%, #3a47d5 100%)",
      },
      Upload: {
        textColor: "#fff",
        backgroundColor: "#4b6cb7",
        gradient: "linear-gradient(to bottom right, #4b6cb7 0%, #182848 100%)",
      },
      Vendor: {
        textColor: "#fff",
        backgroundColor: "#f7d118",
        gradient: "linear-gradient(to bottom right, #f7d118 0%, #c34e4e 100%)",
        menuColor: "#e7a923",
      },
    },
    approvalBtns: {
      draftBtn: {
        maxWidth: "12.5em",
        color: "#2196f3",
        borderColor: "#2196f3",

        "&:hover": {
          backgroundColor: "#E1F5FE",
        },
        "&:focus": {
          backgroundColor: "#0D47A1",
          color: "#fff",
        },
      },
      sendForApprovalBtn: {
        maxWidth: "16em",
        width: "16em",
        borderColor: "#FF6F00",
        color: "#FF6F00",

        "&:hover, &:focus": {
          backgroundColor: "#FFECB3",
          textShadow: "0 0 1px #FFE082",
        },
        "&:focus": {
          color: "#FFF8E1",
          backgroundColor: "#F9A825",
        },
      },
      denyBtn: {
        maxWidth: "12.5em",
        color: "#B71C1C",
        backgroundColor: "#FFEBEE",

        "&:hover, &:focus": {
          backgroundColor: "#EF9A9A",
        },
      },
      approveBtn: {
        maxWidth: "12.5em",
        color: "#008000",
        backgroundColor: "#dcedc8",

        "&:hover, &:focus": {
          backgroundColor: "#8BC34A",
        },
        "&:focus": {
          backgroundColor: "#008000",
          color: "#dcedc8",
        },
      },
      reverseApprovalBtn: {
        color: "#F57F17",
        borderColor: "#FFC107",
        backgroundColor: "#FFF9C4",

        "&:hover, &:focus": {
          backgroundColor: "#FFF59D",
          color: "#F57F17",
          textShadow: "0 0 1px #FFE082",
        },
        "&:focus": {
          color: "#FFF8E1",
          backgroundColor: "#F9A825",
        },
      },
    },
  }
);

export default responsiveFontSizes(theme, {
  breakpoints: ["xs", "sm", "md", "lg", "xl"],
});
