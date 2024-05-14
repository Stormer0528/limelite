import {useState, useEffect} from "react";
import {useCurrentRoute} from "react-navi";
import {useQuery} from "@apollo/react-hooks";
import {formatNumber} from "humanize-plus";
import find from "lodash/find";

import {
  calcReconciledBalance,
  calcCreditBalance,
  filterByStringAttribute,
  objectifyArray,
} from "../../bank_account/statements/show_view/helper_functions";

import StatementShowView from "./view";

import LOAD_STATEMENT_QUERY from "../../../graphql/queries/load_statement.gql";

const ShowView = () => {
  const {
    data: {reconciliationId},
  } = useCurrentRoute();

  const {
    data: {
      statement = {items: [], reconciliations: []},
      statement: {id: statementId, reconciliations = []} = {},
    } = {},
    loading,
  } = useQuery(LOAD_STATEMENT_QUERY, {
    variables: {statementId: reconciliationId},
  });

  const [state, setState] = useState({});

  useEffect(() => {
    if (loading) {
      return;
    }

    // Sorted items
    const items = statement.items.map((item) => ({...item, selected: true}));
    const checks = filterByStringAttribute(items, "type", "Check");
    const deposits = filterByStringAttribute(items, "type", "Deposit");
    const transfers = filterByStringAttribute(items, "type", "AccountTransfer");
    const fromTransfers = transfers.filter(
      ({isFromAccountItem}) => isFromAccountItem
    );
    const toTransfers = transfers.filter(
      ({isToAccountItem}) => isToAccountItem
    );

    // Unselected Items
    const unselectedItems = statement.unreconciledItems.map((item) => ({
      ...item,
      selected: false,
    }));
    const unselectedChecks = filterByStringAttribute(
      unselectedItems,
      "type",
      "Check"
    );
    const unselectedDeposits = filterByStringAttribute(
      unselectedItems,
      "type",
      "Deposit"
    );
    const unselectedFromTransfers = transfers.filter(
      ({isFromAccountItem}) => isFromAccountItem
    );
    const unselectedToTransfers = transfers.filter(
      ({isToAccountItem}) => isToAccountItem
    );

    const credits = [
      ...deposits,
      ...toTransfers,
      ...unselectedDeposits,
      ...unselectedToTransfers,
    ];

    const debits = [
      ...checks,
      ...fromTransfers,
      ...unselectedChecks,
      ...unselectedFromTransfers,
    ];

    const selectedCreditsCount = credits.filter((item) =>
      find(reconciliations, ["reconcilableItemId", item.id])
    ).length;

    const selectedDebitsCount = debits.filter((item) =>
      find(reconciliations, ["reconcilableItemId", item.id])
    ).length;

    const reconciledBalance = calcReconciledBalance(statement.items);
    const totalCredits = calcCreditBalance({
      items: items,
      type: "credit",
    });
    const totalDebits = calcCreditBalance({
      items: items,
      type: "debit",
    });
    const clearedBalance = (
      parseFloat(statement.startingBalance || 0) +
      (totalCredits - totalDebits) / 100
    ).toFixed(2);
    const statementBalance = (
      Number(statement.endingBalance.replace(/[,$]/gi, "")) -
      Number(clearedBalance)
    ).toFixed(2);

    setState({
      items,
      credits,
      debits,
      selectedCreditsCount,
      selectedDebitsCount,
      totalCredits: `$${formatNumber((totalCredits / 100).toFixed(2), 2)}`,
      totalDebits: `$${formatNumber((totalDebits / 100).toFixed(2), 2)}`,
      reconciledBalance: `$${formatNumber(reconciledBalance, 2)}`,
      clearedBalance,
      statementBalance,
      selectedItems: objectifyArray(items),
    });
  }, [
    loading,
    statement.endingBalance,
    statement.items,
    statement.reconciliations,
    statement.startingBalance,
    statement.unreconciledItems,
    statementId,
  ]);

  if (!loading) {
    return (
      <StatementShowView
        {...{statement, ...state, valid: true, readOnly: true, editable: false}}
      />
    );
  }

  return null;
};

export default ShowView;
