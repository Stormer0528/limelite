// import findIndex from "lodash/findIndex";
import produce from "immer";

const AccountFundIndexModel = {
  state: {
    organization: {},
    funds: [],
  },
  reducers: {
    setOrganization: (state, organization) =>
      produce(state, nextState => {
        nextState.organization = organization;
      }),
    setFunds: (state, funds) =>
      produce(state, nextState => {
        nextState.funds = funds;
      })
  },
};

export default AccountFundIndexModel;
