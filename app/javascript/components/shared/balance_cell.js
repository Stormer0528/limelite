import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";

const BalanceCell = ({
  balance,
  deleteSign = true,
  parenthesis = false,
  classes = {},
}) => {
  const text = deleteSign && balance && balance[0] == '$' ? balance.slice(1) : (balance || '')

  return (
    <div>
      <div className={classes.container}>
        { (parenthesis || balance?.includes('-')) && '(' || '' }
        { text.toString().replace('-', '') }
        { (parenthesis || balance?.includes('-')) && ')' || '' }
      </div>
    </div>
  )
};

BalanceCell.propTypes = {
  balance: PropTypes.string,
  deleteSign: PropTypes.bool,
  parenthesis: PropTypes.bool
};

const styles = (theme) => ({
  container: {
    textAlign: 'right',
    width: '8em',
    display: 'inline-block'
  }
});

export default withStyles(styles)(BalanceCell);

export function getChangesPrice(current_balance, before_balance) {
  if (!current_balance || !before_balance) {
    return '';
  }

  const current = Number(current_balance.replace(/[,$]/g, ''))
  const before = Number(before_balance.replace(/[,$]/g, ''));

  return '$' + Number(current - before).toFixed(2).toString();
}

export function getChangesPercentage(current_balance, before_balance) {
  if (!current_balance || !before_balance) {
    return '';
  }

  const current = Number(current_balance.replace(/[,$]/g, ''))
  const before = Number(before_balance.replace(/[,$]/g, ''));

  return before ? Number((current-before) / before * 100).toFixed(2) + '%' : '0%';
}
