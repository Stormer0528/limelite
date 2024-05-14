import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import {format} from "date-fns/esm";
import {getFiscalYear} from "../../../utils";

const ReportHeader = ({startDate, endDate, classes = {}}) => {
  return (
    <header
      style={{
        display: "flex",
        flexDirection: "row",
        padding: "1em 0",
      }}
    >
      <div style={{flexGrow: 1, marginTop: "0.5em"}}>
        <div style={{flexGrow: "1", width: "25%"}}>
          <b>Fiscal&nbsp;Year:&nbsp;</b>
          {getFiscalYear(endDate || new Date())}
        </div>
        <div style={{flexGrow: "2"}}>
          <b>Report&nbsp;Date:&nbsp;</b>
          {format(new Date(), "MM/dd/yyyy")}
        </div>
      </div>
      <div style={{width: "50%", flexGrow: 3}}>
        <h2 className={`subtitle ${classes.subtitle}`} style={{flexGrow: "3"}}>
          Budget vs Actual
        </h2>
        <h3 className={`subsubtitle ${classes.subsubtitle}`}>
          From {format(startDate, "MM/dd/yyyy")} to{" "}
          {format(endDate, "MM/dd/yyyy")}
        </h3>
      </div>
      <div style={{flexGrow: 1, width: "15%"}} />
    </header>
  );
};

ReportHeader.propTypes = {
  fiscalYear: PropTypes.string,
  organizationName: PropTypes.string,
  startDate: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  endDate: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
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
    fontSize: "1.75rem",
    margin: "0 0 1rem",
  },
  subsubtitle: {
    textAlign: "center",
    fontSize: "1rem",
    fontWeight: "300",
    margin: "-0.5rem 0 1em",
  },
});

export default withStyles(styles)(ReportHeader);
