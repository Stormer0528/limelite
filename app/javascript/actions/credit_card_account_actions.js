// CreditCard Actions
//------------------------------------------------------------------------------

export function addAccount(account) {
  return {type: "ADD_ACCOUNT", account};
}

export function removeAccount(account) {
  return {type: "REMOVE_ACCOUNT", account};
}

export function setCurrentAccount(account) {
  return {type: "SET_CURRENT_ACCOUNT", account};
}

export function addCreditCardCharge(charge) {
  return {type: "ADD_CREDIT_CARD_CHARGE", charge};
}

export function removeCreditCardCharge(charge) {
  return {type: "REMOVE_CREDIT_CARD_CHARGE", charge};
}
