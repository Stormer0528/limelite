import {
  BrowserRouter as Router,
  Route,
  Switch,
  // Redirect,
} from "react-router-dom";

// Reports
import IndexPage from "./index_page";
import ApAgingReport from "./ap_aging_report";
import ArAgingReport from "./ar_aging_report";
import BalanceSheet from "./balance_sheet";
import BalanceSheetByMonth from "./balance_sheet_by_month";
import ComparativeBalanceSheet from "./comparative_balance_sheet";
import BalanceSheetByResource from "./balance_sheet_by_resource";
import CashFlowReport from "./cash_flow_report";
import MonthlyCashFlowReport from "./monthly_cash_flow_report";
import MonthlyProfitAndLossStatement from "./monthly_profit_and_loss_statement";
import ProfitAndLossByResource from "./profit_and_loss_by_resource";
import ProfitAndLossStatement from "./profit_and_loss_statement";
import ComparativeProfitAndLossStatement from "./comparative_profit_and_loss_statement";
import Vendor1099Report from "./vendor_1099_report";
import VendorReport from "./vendor_report";
import CheckRegisterReport from "./check_register";
import BudgetVsActualReport from "./budget_vs_actual";

const ReportRouter = () => {
  return (
    <Router basename="/reports">
      <Switch>
        <Route path="/ap-aging-report" component={ApAgingReport} />
        <Route path="/ar-aging-report" component={ArAgingReport} />
        <Route
          path="/profit-and-loss-statement"
          component={ProfitAndLossStatement}
        />
        <Route
          path="/monthly-profit-and-loss-statement"
          component={MonthlyProfitAndLossStatement}
        />
        <Route path="/balance-sheet" component={BalanceSheet} />
        <Route path="/balance-sheet-by-month" component={BalanceSheetByMonth} />
        <Route path="/comparative-balance-sheet" component={ComparativeBalanceSheet} />
        <Route
          path="/balance-sheet-by-resource"
          component={BalanceSheetByResource}
        />
        <Route path="/cash-flow-report" component={CashFlowReport} />
        <Route
          path="/monthly-cash-flow-report"
          component={MonthlyCashFlowReport}
        />
        <Route
          path="/profit-and-loss-by-resource-report"
          component={ProfitAndLossByResource}
        />
        <Route
          path="/comparative-profit-and-loss-statement"
          component={ComparativeProfitAndLossStatement}
        />
        <Route path="/vendor-1099-report" component={Vendor1099Report} />
        <Route path="/vendor-report" component={VendorReport} />
        <Route path="/check-register-report" component={CheckRegisterReport} />
        <Route path="/budget-vs-actual" component={BudgetVsActualReport} />

        <Route exact path="/" component={IndexPage} />
      </Switch>
    </Router>
  );
};

export default ReportRouter;
