import InvoiceModal from "./invoice_modal";
import Button from "@material-ui/core/Button";
import View from "@material-ui/icons/RemoveRedEye";
import {useState} from "react";

const InvoiceModalBtn = ({id, path}) => {
  const [open, setOpen] = useState(false);

  const handleOpen = (e) => {
    e.persist();
    e.stopPropagation();
    setOpen(true);
  };

  const handleClose = (e) => {
    e.persist();
    e.stopPropagation();
    setOpen(false);
  };

  return (
    <>
      <Button onClick={handleOpen}>
        <View />
      </Button>
      {open && <InvoiceModal {...{open, handleClose, handleOpen, id, path}} />}
    </>
  );
};

export default InvoiceModalBtn;
