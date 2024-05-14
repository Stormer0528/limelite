import {withKnobs, select, number} from "@storybook/addon-knobs";
import {action} from "@storybook/addon-actions";
import {CSSBaseline} from "../../shared/stories/theme_decorator";

import Footer from "./footer";

export default {
  component: Footer,
  title: "/Statements/Approval Footer",
  decorators: [
    withKnobs,
    CSSBaseline,
    (storyFn) => {
      return <div style={{minHeight: 200}}>{storyFn()}</div>;
    },
  ],
};

export const Default = () => {
  const starting_balance = number("Starting Balance", 0.0, {}, "Balances");
  const totalCredits = number("Total Credits", 100.0, {}, "Balances");
  const totalDebits = number("Total Debits", 1250.0, {}, "Balances");

  const ending_balance = number("Ending Balance", 0.0, {}, "Balances");
  const remainingBalance = number("Remaining Balance", 0.0, {}, "Balances");

  const statement_balance = number("Statement Balance", 0.0, {}, "Balances");
  const clearedBalance =
    Number(starting_balance) + Number(totalCredits) - Number(totalDebits);
  const aasm_state = select(
    "AASM State",
    {
      Draft: "draft",
      NeedsApproval: "needs_approval",
      Approved: "approved",
      NeedsRevision: "needs_revision",
    },
    "draft",
    "State"
  );

  return (
    <Footer
      {...{
        starting_balance,
        ending_balance,
        remainingBalance,
        totalCredits,
        totalDebits,
        statement_balance,
        clearedBalance,
        aasm_state,
        createSubmitHandler: () => action("createSubmitHandler"),
        handletoggleConfirmationModal: action("handletoggleConfirmationModal"),
      }}
    />
  );
};
