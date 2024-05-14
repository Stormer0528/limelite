/**
 * A Class component for MUI or react-router links that require a ref
 */
import PropTypes from "prop-types";
import {NavLink} from "react-router-dom";
import Button from "@material-ui/core/Button";

export class NavButtonLink extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {component: Component = NavLink, ...rest} = this.props;
    return <Button component={Component} {...rest} />;
  }
}

NavButtonLink.propTypes = {
  component: PropTypes.element,
};

export default NavButtonLink;
