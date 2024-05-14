import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import {format} from "date-fns/esm";

const ReportHeader = ({start_date, end_date, classes = {}}) => {
  return (
    <header
      style={{
        display: "flex",
        flexDirection: "row",
        padding: "1em 0",
      }}
    >
      <div style={{flexGrow: 1}}>
        <div style={{flexGrow: "1", width: "25%"}}>
          Fiscal&nbsp;Year:&nbsp;
          {getFiscalYear(end_date || new Date())}
        </div>
        <div style={{flexGrow: "2"}}>
          Report&nbsp;Date:&nbsp;
          {format(new Date(), "MM/dd/yyyy")}
        </div>
      </div>
      <div style={{width: "50%", flexGrow: 3}}>
        <h2 className={`subtitle ${classes.subtitle}`} style={{flexGrow: "3"}}>
          Monthly Profit And Loss Statement by Fund
        </h2>
        <h3 className={`subsubtitle ${classes.subsubtitle}`}>
          From {format(start_date, "MM/dd/yyyy")} to{" "}
          {format(end_date, "MM/dd/yyyy")}
        </h3>
      </div>
      <div style={{flexGrow: 1, width: "15%"}} />
    </header>
  );
};

ReportHeader.propTypes = {
  fiscalYear: PropTypes.string,
  organizationName: PropTypes.string,
  start_date: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  end_date: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  updated_at: PropTypes.string,
  accountFundCode: PropTypes.string,
  accountFundName: PropTypes.string,
  classes: PropTypes.object,
};

const styles = theme => ({
  title: {
    textAlign: "center",
    fontSize: "1.35em",
    fontWeight: "bold",
    marginBottom: "0.35em",
  },
  subtitle: {
    textAlign: "center",
    fontSize: "1.15rem",
    margin: "0 0 1em",
  },
  subsubtitle: {
    textAlign: "center",
    fontSize: "1rem",
    fontWeight: "300",
    margin: "-0.5rem 0 1em",
  },
});

export default withStyles(styles)(ReportHeader);

// Helper Functions
//------------------------------------------------------------------------------

function getFiscalYear(date = new Date()) {
  const year = parseInt(format(date, "YYYY"));
  const fiscalYearStart = parseInt(format(new Date(`${year}-07-01`), "D"));
  const dayOfYear = format(date, "D");
  return dayOfYear < fiscalYearStart ? year : year + 1;
}
