import {useState, useEffect} from "react";
import PropTypes from "prop-types";
import {useFormikContext} from "formik";
import {useCurrentRoute} from "react-navi";
import {useMutation} from "@apollo/react-hooks";
import {withStyles} from "@material-ui/core/styles";

import Fade from "@material-ui/core/Fade";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import ConfirmIcon from "@material-ui/icons/CheckCircleOutline";

import ChecksTable from "./checks_table";
import CONFIRM_CHECKS_MUTATION from "../../../graphql/mutations/mark_checks_printed.gql";

const createSortWorker = () => new Worker("./sort.worker", {type: "module"});
const ConfirmationModal = ({
  isModalOpen = false,
  handleModalClose = function () {},
  classes = {},
}) => {
  const {
    data: {
      bank_account: {id: bankAccountId},
    },
  } = useCurrentRoute();

  const [errors, setErrors] = useState([]);
  const {
    values: {checkedItems, confirmedItems},
  } = useFormikContext();

  const [items, setItems] = useState([]);
  useEffect(() => {
    const sortWorker = createSortWorker();
    sortWorker.onmessage = function ({data: items}) {
      setItems(items);
      sortWorker.terminate();
    };

    sortWorker.postMessage({
      items: Object.values(checkedItems),
      sort: {name: "number", direction: "desc"},
      checkedItems: {},
    });
  }, [checkedItems]);
  const [confirmChecks] = useMutation(CONFIRM_CHECKS_MUTATION);
  const handleConfirm = async () => {
    const checks = Object.values(confirmedItems).map(({id, number}) => ({
      id,
      number,
    }));
    try {
      const {
        data: {markChecksPrinted: {success, errorMessages = []} = {}} = {},
      } = await confirmChecks({
        variables: {bankAccountId, checks},
      });

      if (success) {
        window.location.reload();
        handleModalClose();
      } else {
        setErrors(errorMessages);
      }
    } catch (e) {
      console.error(e);
      alert(`There was an error processing your request: ${e}`);
    }
  };
  return (
    <Dialog
      fullWidth
      maxWidth="xl"
      onClose={handleModalClose}
      aria-labelledby="check-print-confirmation"
      open={isModalOpen}
    >
      <DialogTitle id="check-print-confirmation">
        <ConfirmIcon className={classes.headerIcon} />
        &nbsp;Confirm Printed Checks
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        {errors && errors.length > 0 && (
          <Fade in>
            <ul className={`${classes.errors} browser-default`}>
              {errors.map((msg, i) => (
                <li key={i} className={classes.item}>
                  <b>Error:</b>
                  {msg}
                </li>
              ))}
            </ul>
          </Fade>
        )}
        <ChecksTable
          itemsKey="confirmedItems"
          items={items}
          setItems={setItems}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleModalClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleConfirm} color="primary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ConfirmationModal.propTypes = {
  isModalOpen: PropTypes.bool,
  handleModalClose: PropTypes.func,
  classes: PropTypes.object,
};

const styles = (theme) => ({
  dialogContent: {
    padding: "0",
    flexBasis: "350px",
    display: "flex",
    flexDirection: "column",
    border: "1px solid #ddd",
    borderWidth: "1px 0",
    flexGrow: 1,
    flexShrink: 1,
  },
  headerIcon: {
    position: "relative",
    top: ".45rem",
  },
  errors: {
    padding: "0",
    margin: "0",
  },
  item: {
    listStyle: "none",
    color: "#B71C1C",
    background: "#FCE4EC",
    padding: ".25em 1em",
    margin: ".25rem 0",
  },
});

export default withStyles(styles)(ConfirmationModal);
