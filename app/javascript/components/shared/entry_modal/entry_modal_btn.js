import EntryModal from "../entry_modal";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";
import {Fragment, useState} from "react";

const EntryModalBtn = ({text = "Entry", ...rest}) => {
  const [open, setOpen] = useState(false);
  const handleClose = (e) => {
    e.persist();
    e.stopPropagation();
    setOpen(false);
  };

  const handleOpen = (e) => {
    e.persist();
    e.stopPropagation();
    setOpen(true);
  };

  return (
    <Fragment>
      <Button onClick={handleOpen}>{text}</Button>
      {open && <EntryModal {...{open, handleClose, handleOpen, ...rest}} />}
    </Fragment>
  );
};

EntryModalBtn.propTypes = {
  text: PropTypes.string,
};

export default EntryModalBtn;
