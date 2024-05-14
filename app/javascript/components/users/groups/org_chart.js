import React from "react";
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Tree, {treeChartStyles} from "@mui-treasury/components/chart/tree";

const OrgChart = ({
  treeData,
  refetch = function () {},
  renderContent,
  organizationId,
  useStyles = defaultUseStyles,
  ...props
}) => {
  if (!treeData) {
    return null;
  }

  const renderChildren = (children = []) => {
    return (
      <Tree.Branches>
        {children.map((item, index) => (
          <Tree.Twig key={index}>
            <Tree.Stem>{renderContent(item, refetch, organizationId)}</Tree.Stem>
            {item.children && renderChildren(item.children)}
          </Tree.Twig>
        ))}
      </Tree.Branches>
    );
  };

  return (
    <Tree useStyles={useStyles} {...props}>
      <Tree.Trunk style={{marginLeft: "-50vw"}}>
        {Array.isArray(treeData) ? (
          renderChildren(treeData)
        ) : (
          <>
            {renderContent(treeData, refetch, organizationId)}
            {treeData.children && renderChildren(treeData.children)}
          </>
        )}
      </Tree.Trunk>
    </Tree>
  );
};

OrgChart.propTypes = {
  treeData: PropTypes.oneOfType([
    PropTypes.shape({}),
    PropTypes.arrayOf(PropTypes.shape({})),
  ]),
  refetch: PropTypes.func,
  renderContent: PropTypes.func,
  useStyles: PropTypes.func,
};

OrgChart.defaultProps = {
  treeData: undefined,
  renderContent: () => <Avatar />,
  useStyles: defaultUseStyles,
};

const styles = (theme) => {
  // console.log(treeChartStyles(theme));
  const treeStyles = treeChartStyles(theme);
  return {
    ...treeStyles,
    trunk: {
      ...treeStyles.trunk,
      padding: "0 !important",
    },
  };
};
const defaultUseStyles = makeStyles(styles, {name: "OrgChart"});

export default OrgChart;
