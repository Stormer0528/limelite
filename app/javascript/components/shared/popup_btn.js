import PropTypes from "prop-types";
import Popover from "@material-ui/core/Popover";
import Button from "@material-ui/core/Button";

import {withStateHandlers} from "recompose";

const PopupBtn = ({
  text,
  popupProps = {},
  buttonProps = {},
  Component = Button,
  open = false,
  children = null,
  handleClose = function () {},
  handleOpen = function () {},
}) => {
  return (
    <Component onClick={open ? handleClose : handleOpen} {...buttonProps}>
      {text}
      <Popover
        {...{
          open,
          onClose: handleClose,
          anchorOrigin: {
            vertical: "center",
            horizontal: "center",
          },
          transformOrigin: {
            vertical: "top",
            horizontal: "center",
          },
        }}
        {...popupProps}
      >
        {children}
      </Popover>
    </Component>
  );
};

PopupBtn.propTypes = {
  text: PropTypes.string,
  open: PropTypes.bool,
  children: PropTypes.any,
  popupProps: PropTypes.object,
  buttonProps: PropTypes.object,
  Component: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  handleOpen: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default withStateHandlers(
  ({initialOpen = false}) => ({
    open: initialOpen,
  }),
  {
    handleClose: () => (e) => {
      e.persist();
      e.stopPropagation();
      return {open: false};
    },
    handleOpen: () => (e) => {
      e.persist();
      e.stopPropagation();
      return {open: true};
    },
  }
)(PopupBtn);
