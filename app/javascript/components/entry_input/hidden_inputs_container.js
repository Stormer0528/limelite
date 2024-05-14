import HiddenInputs from "./hidden_inputs";
import isEqual from "lodash/isEqual";
import {connect} from "react-redux";
import {graphql} from "react-apollo";
import {compose} from "redux";
import accountQuery from "../../graphql/queries/validate_account.gql";
const mapStateToProps = (
  // State
  {
    entry: {
      entry_id,
      date,
      entry_type,
      defaultObjectCode: objectCode,
      entryItems,
      entryItems: {
        [0]: {
          fundCode,
          resourceCode,
          yearCode,
          goalCode,
          functionCode,
          locationCode,
        } = {},
      } = [],
    },
  } = {},
  // Props
  {
    data: {
      refetch = function() {},
      variables: vars = {},
      accountByNumber = {},
    } = {},
  } = {}
) => {
  // Need to set default here since sometimes it's null
  const {id: accountId} = accountByNumber || {};

  // Refecth account if not set or fundCode changes
  if (fundCode && !isEqual({objectCode, fundCode}, vars)) {
    refetch({
      objectCode,
      fundCode,
      resourceCode,
      yearCode,
      goalCode,
      functionCode,
      locationCode,
    });
  }

  return {
    entry_id,
    date,
    entry_type,
    entryItems,
  };
};

const mapGqlStateToProps = ({
  entry: {entryItems: entry_items, amountType, defaultObjectCode},
}) => {
  return {
    defaultObjectCode,
    entry_items,
    amountType,
  };
};

export default compose(
  connect(mapGqlStateToProps),
  graphql(accountQuery, {
    skip: props => {
      return (
        props.amountType === "both" ||
        !props.entryItems ||
        !props.entryItems[0]["fundCode"]
      );
    },
    options: props => {
      const {
        defaultObjectCode: objectCode,
        entryItems: {
          [0]: {
            fundCode,
            resourceCode,
            yearCode,
            goalCode,
            functionCode,
            locationCode,
          } = {},
        } = [],
      } = props;

      return {
        name: "account",
        variables: {
          fundCode,
          objectCode,
          resourceCode,
          yearCode,
          goalCode,
          functionCode,
          locationCode,
        },
      };
    },
  }),
  connect(mapStateToProps)
)(HiddenInputs);
