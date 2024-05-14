// Switch for determining the correct preview component for AuthableType

import PropTypes from "prop-types";
import PurchaseOrderPreview from "./previews/po_preview";

const Preview = ({authableType, ...rest}) => {
  const Component = getPreviewComponent(authableType);
  return <Component {...rest} />;
};
Preview.propTypes = {
  authableType: PropTypes.oneOf(["PurchaseOrder", "BatchUpload"]).isRequired,
};

const getPreviewComponent = (authableType) => {
  switch (authableType) {
    case "PurchaseOrder":
      return PurchaseOrderPreview;
    default:
      return () => <h4>Unkown Authable Type</h4>;
  }
};

export default Preview;
