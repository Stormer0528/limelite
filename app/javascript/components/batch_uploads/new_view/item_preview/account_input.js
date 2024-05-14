import PropTypes from "prop-types";
import {useCallback} from "react";

import ElementInputs from "@components/entries/form/entry_item/element_inputs";
import useEntryCallbacks from "@components/entries/form/use_entry_callbacks";
import AccountFinder from "@components/accounts/account_finder";
import {AccountFinderProvider} from "@components/accounts/account_finder/context";
import {makeStyles} from "@material-ui/core/styles";

export default function AccountInput({
  i: currentEntryIndex,
  name,
  account = {},
  handleAccountFinderUpdate = function () {},
  handleChange = function () {},
}) {
  const {vadlidateAccountCode} = useEntryCallbacks();
  const onAccountFinderUpdate = () => {};

  const handleBlurValidation = useCallback(() => {
    vadlidateAccountCode(account, (account) => {
      if (account && account.accountId) {
        handleChange({
          target: {
            name: `filesUploaded.${currentEntryIndex}.accountId`,
            value: account.id,
          },
        });

        handleChange({
          target: {
            name: `${name}.account`,
            value: account,
          },
        });
      }
    });
  }, [vadlidateAccountCode, account, handleChange, name, currentEntryIndex]);

  const classes = useStyles();

  return (
    <div onBlur={handleBlurValidation} className={classes.root}>
      <AccountFinderProvider
        value={{
          currentEntryIndex,
          onAccountFinderSelect: handleAccountFinderUpdate(name),
        }}
      >
        <h6 className={classes.inputsHeader}>Account String</h6>
        <div className={classes.inputsContainer}>
          <ElementInputs
            {...account}
            name={`${name}.account`}
            handleChange={handleChange}
            handleBlur={function () {}}
          />
        </div>

        <AccountFinder
          {...{
            setCurrentEntryItemCode: handleAccountFinderUpdate,
            onAccountFinderUpdate,
            onAccountFinderSelect: handleAccountFinderUpdate,
            onAccountCreated: onAccountFinderUpdate,
          }}
        />
      </AccountFinderProvider>
    </div>
  );
}

AccountInput.propTypes = {
  i: PropTypes.number,
  name: PropTypes.string,
  account: PropTypes.object,
  handleChange: PropTypes.func,
  handleAccountFinderUpdate: PropTypes.func,
};

const useStyles = makeStyles(() => ({
  inputsContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",

    "& span.dash-spacer": {
      display: "inline-block",
      margin: "0 .85rem",
    },

    "& input": {
      borderRadius: "3px !important",
      background: "#f9f9f9 !important",
      padding: ".5rem !important",
    },
  },
}));
