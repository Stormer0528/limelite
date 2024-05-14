import PropTypes from "prop-types";
// import {NavLink} from "react-router-dom";

const Breadcrumb = ({path = []}) => {
  return (
    <h2 className="page-header">
      <i className="material-icons medium">monetization_on</i>
      <span className="text">
        <a href="/bank_accounts" className="breadcrumb primary">
          Bank Accounts
        </a>
        {path.map(({text, path}) => {
          return (
            <a key={`${text}-${path}`} href={path} className="breadcrumb">
              <span className="link-text">{text}</span>
            </a>
          );
        })}
      </span>
    </h2>
  );
};

Breadcrumb.propTypes = {
  path: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
      path: PropTypes.string,
    })
  ),
};
export default Breadcrumb;
