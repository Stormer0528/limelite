import {makeStyles, withStyles} from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";

import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";

import AccountFundIcon from "@shared/icons/fund_icon";

function AccountFundBtns({accountFunds = [], fund, setFund}) {
  const onChange = (event, fund) => {
    if (fund) {
      setFund(fund);
    }
  };

  const classes = useStyles();
  return (
    <Paper elevation={0} className={classes.paper}>
      <StyledToggleButtonGroup
        value={fund}
        exclusive
        size="small"
        onChange={onChange}
        aria-label="Account Fund"
        className={classes.tabs}
      >
        {accountFunds.map((code) => {
          return (
            <ToggleButton
              value={code}
              aria-label={`Account Fund ${code}`}
              key={code}
            >
              <AccountFundIcon size="small" />
              {code}
            </ToggleButton>
          );
        })}
        <Divider flexItem orientation="vertical" className={classes.divider} />
        <ToggleButton value="all" aria-label="All Funds">
          <AccountFundIcon size="small" />
          All
        </ToggleButton>
      </StyledToggleButtonGroup>
    </Paper>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    display: "flex",
    border: `1px solid ${theme.palette.divider}`,
    flexWrap: "wrap",
  },
  divider: {
    margin: theme.spacing(1, 0.5),
  },
}));

const StyledToggleButtonGroup = withStyles((theme) => ({
  grouped: {
    margin: theme.spacing(0.5),
    border: "none",
    "&:not(:first-child)": {
      borderRadius: theme.shape.borderRadius,
    },
    "&:first-child": {
      borderRadius: theme.shape.borderRadius,
    },
  },
}))(ToggleButtonGroup);

export default AccountFundBtns;
