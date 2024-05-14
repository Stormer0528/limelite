import PropTypes from "prop-types";

const Fab = ({account_id}) => {
  return (
    <div className="fixed-action-btn">
      <a
        href={`/bank_accounts/${account_id}/reconciliations/new`}
        className="btn-floating btn-large green lighten-1"
      >
        <i className="material-icons large">add</i>
      </a>
    </div>
  );
};

Fab.propTypes = {
  account_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default Fab;
