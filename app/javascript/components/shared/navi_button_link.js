/**
 * A Class component for MUI or react-router links that require a ref
 */
import {Link as NavLink} from "react-navi";
import Button from "@material-ui/core/Button";

export class NaviButtonLink extends React.Component {
  render() {
    return <Button component={NavLink} {...this.props} />;
  }
}

export default NaviButtonLink;
