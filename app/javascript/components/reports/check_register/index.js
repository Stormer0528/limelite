import {compose} from "redux";
import {Formik} from "formik";
import gql from "graphql-tag";
import {useQuery} from "@apollo/react-hooks";

import DateWrapper from "../../shared/date_wrapper";
import ThemeWrapper from "../../shared/theme_wrapper";

import CheckRegister from "./check_register";

const REPORT_QUERY = gql`
  query {
    fundCodes: account_funds {
      code
    }
    fiscalYear
    bankAccounts {
      id
      name
    }
  }
`;

const CheckRegisterContainer = () => {
  const {
    loading,
    data: {fundCodes = [], fiscalYear, bankAccounts = []} = {},
  } = useQuery(REPORT_QUERY);
  return loading ? null : (
    <Formik
      initialValues={{
        approved: true,
        reconciled: true,
        type: "Check",
        dateFilter: "Between",
        afterDate: `${fiscalYear}-07-01`,
        beforeDate: `${fiscalYear + 1}-06-30`,
        bankAccounts,
      }}
    >
      {() => {
        return (
          <CheckRegister
            {...{
              fundCodes: fundCodes
                .map((obj) => obj.code)
                .sort((a, b) => Number(a) - Number(b)),
            }}
          />
        );
      }}
    </Formik>
  );
};

// Export
//------------------------------------------------------------------------------
export default compose(ThemeWrapper, DateWrapper)(CheckRegisterContainer);
