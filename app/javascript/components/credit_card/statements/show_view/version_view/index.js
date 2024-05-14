import {useState, useCallback} from "react";
import {useQuery} from "react-apollo";
import {formatNumber} from "humanize-plus";
import {useParams} from "react-router-dom";
import STATEMENT_VERSION_QUERY from "@graphql/queries/statement_version.gql";
import View from "./view";

const VersionView = (props) => {
  const [debitsOpen, setDebitsOpen] = useState(true);
  const [creditsOpen, setCreditsOpen] = useState(true);

  const handleCreditsContainerClick = useCallback(() => {
    setCreditsOpen(!creditsOpen);
  });

  const handleDebitsContainerClick = useCallback(() => {
    setDebitsOpen(!debitsOpen);
  });

  const {statement_id: reconciliationId, version_id: versionId} = useParams();
  const {
    data: {
      revision: {adjustmentAmountInCents = 0, startingBalanceInCents = 0} = {},
      revision = {},
      ...rest
    } = {},
    loading,
    error,
  } =
    useQuery(STATEMENT_VERSION_QUERY, {
      variables: {
        reconciliationId,
        versionId,
      },
      fetchPolicy: "network-only",
    }) || {};

  const associatedItems = JSON.parse(revision.associatedItems || "{}");
  const {items: {credits = [], debits = []} = {}} = associatedItems;

  if (loading) {
    return null;
  }
  console.log(rest);

  if (error) {
    console.error("Fetch Error:", error);
  }

  const totalCredits = credits.reduce(
    (total, {amount_in_cents: cents = 0}) => total + cents,
    0
  );

  const totalDebits = debits.reduce(
    (total, {amount_in_cents: cents = 0}) => total + cents,
    0
  );

  const clearedBalance = startingBalanceInCents + totalDebits - totalDebits;

  return (
    <View
      {...props}
      statement={revision}
      handleCreditsContainerClick={handleCreditsContainerClick}
      handleDebitsContainerClick={handleDebitsContainerClick}
      debitsOpen={debitsOpen}
      creditsOpen={creditsOpen}
      {...{
        credits,
        debits,
        clearedBalance: `$${formatNumber(
          (clearedBalance / 100).toFixed(2),
          2
        )}`,
        startingBalance: `$${formatNumber(
          (clearedBalance / 100).toFixed(2),
          2
        )}`,
        adjustmentAmount: `$${formatNumber(
          (adjustmentAmountInCents / 100).toFixed(2),
          2
        )}`,
        totalCredits: `$${formatNumber((totalCredits / 100).toFixed(2), 2)}`,
        totalDebits: `$${formatNumber((totalDebits / 100).toFixed(2), 2)}`,
      }}
    />
  );
};

export default VersionView;
