import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import {format} from "date-fns/esm";

const ReportHeader = ({
  organizationName,
  endDate,
  updatedAt,
  accountFundCode,
  accountFundName,
  classes = {},
}) => {
  return (
    <table className="header">
      <tbody>
        <tr>
          <td style={{width: "25%"}}>
            <p>
              Fiscal&nbsp;Year:&nbsp;
              {getFiscalYear(endDate)}
            </p>
            <p>
              Report&nbsp;Date:&nbsp;
              {format(updatedAt, "MM/dd/yyyy")}
            </p>
          </td>
          <td style={{width: "50%"}}>
            <h1 className={`title ${classes.title}`}>{organizationName}</h1>
            <h2 className={`subtitle ${classes.subtitle}`}>
              Financial&nbsp;Summary for Period&nbsp;Ending:&nbsp;
              {format(endDate, "MM/dd/yyyy")}
            </h2>
            <h3 className={`subsubtitle ${classes.subsubtitle}`}>
              Fund: {accountFundCode} &mdash; {accountFundName}
            </h3>
          </td>
          <td style={{width: "25%"}} />
        </tr>
      </tbody>
    </table>
  );
};

ReportHeader.propTypes = {
  fiscalYear: PropTypes.string,
  organizationName: PropTypes.string,
  endDate: PropTypes.string,
  updatedAt: PropTypes.string,
  accountFundCode: PropTypes.string,
  accountFundName: PropTypes.string,
  classes: PropTypes.object,
};

const styles = (theme) => ({
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
