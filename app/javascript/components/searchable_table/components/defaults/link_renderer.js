/**
* Default Link Renderer - renders data as a link
  @param data - object with shape rowData: { path = '#!' }
*/

import PropTypes from "prop-types";
import compact from "lodash/compact";

const DefaultLinkRenderer = (
  name_property,
  path_property,
  {
    prefix = "",
    suffix = "",
    disableSort = false,
    component: LinkComponent = "a",
    linkProperty,
  } = {}
) => {
  const linkProp = linkProperty || LinkComponent === "a" ? "href" : "to";

  const renderFunc = ({rowData = {}}) => {
    const linkPath = compact([prefix, rowData[path_property], suffix]).join(
      "/"
    );
    return (
      <LinkComponent {...{[linkProp]: linkPath, target: "_blank"}}>
        {rowData[name_property]}
      </LinkComponent>
    );
  };

  renderFunc.propTypes = {
    field: PropTypes.string,
    rowData: PropTypes.shape({
      path: PropTypes.string,
    }),
  };

  renderFunc.disableSort = disableSort;

  return renderFunc;
};

export default DefaultLinkRenderer;
