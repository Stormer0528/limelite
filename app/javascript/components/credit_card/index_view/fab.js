import PropTypes from "prop-types";

const Fab = () => {
  return (
    <div className="fixed-action-btn">
      <a
        href={"/credit_cards/new"}
        className="btn-floating btn-large green lighten-1"
      >
        <i className="material-icons large"> add</i>
      </a>
    </div>
  );
};

Fab.propTypes = {
  account_id: PropTypes.string,
};

export default Fab;
