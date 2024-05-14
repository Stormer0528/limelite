import PropTypes from "prop-types";
import {useCallback} from "react";
import clamp from "lodash/clamp";
import clsx from "clsx";

import Button from "@material-ui/core/Button";
import EntryItem from "./entry_item";

import {withStyles} from "@material-ui/core/styles";
import {useField} from "formik";

import {useSetRecoilState} from "recoil";
import currentEntryIndexState from "./current_entry_index.atom";

import {Virtuoso} from "react-virtuoso";

function EntryItems({
  name = "",
  addItemLabel = "+ Item",
  disabled = false,
  readOnly = false,
  remove = function () {},
  classes = {},
}) {
  const setCurrentEntryIndex = useSetRecoilState(currentEntryIndexState);
  const [{value: items, value: {length} = {}}, , {setValue}] = useField(name);

  const addEntryItem = useCallback(
    (e) => {
      e.preventDefault();
      setValue([...items, {amount: 0}]);
    },
    [items, setValue]
  );

  const createRemoveItemHandler = useCallback(
    (index) => () => {
      remove(index);
    },
    [remove]
  );

  const height = clamp(length * 84, 84, vhTOpx(50));
  const getItem = useCallback(
    (index) => {
      return (
        <EntryItem
          {...{
            index,
            name: `${name}[${index}]`,
            createRemoveItemHandler,
            setCurrentEntryIndex,
            disabled,
            readOnly,
          }}
          key={index}
        />
      );
    },
    [createRemoveItemHandler, setCurrentEntryIndex, disabled, readOnly, name]
  );

  const style = {width: "auto", height: height || 84};

  return (
    <div className="EntryItemsContainer">
      <h5 className={classes.titleHeader}>
        <div className={classes.text}>Accounts</div>
        {!readOnly && (
          <Button disabled={disabled} onClick={addEntryItem}>
            {addItemLabel}
          </Button>
        )}
      </h5>

      <section
        className={clsx(classes.entryItemsContainer, "EntryItemsSection")}
      >
        <Virtuoso
          overscan={1}
          fixedItemHeight={84}
          style={style}
          totalCount={length}
          itemContent={getItem}
          followOutput
        />
      </section>
    </div>
  );
}

EntryItems.propTypes = {
  name: PropTypes.string,
  addItemLabel: PropTypes.string,
  entryItems: PropTypes.arrayOf(PropTypes.shape({})),
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  classes: PropTypes.object.isRequired,
  remove: PropTypes.func.isRequired,
};

const styles = () => ({
  formHeader: {
    background: "#f5f5f5",
    borderBottom: "1px solid #CFD8DC",
    color: "#607D8B",
    display: "flex",
    fontSize: "1.64rem",
    margin: "0 -14px 0.25em",
    padding: ".5rem 1em",
  },
  headerIcon: {
    position: "relative",
    top: "1px",
    marginRight: ".25em",
  },
  titleHeader: {
    borderBottom: "1px solid #b8c9d0",
    paddingBottom: "0.25em",
    display: "flex",
    alignItems: "center",
    alignContent: "center",
    margin: "0.25em 0 0",
  },
  icon: {
    color: "#78909C",
  },
  text: {
    flex: "auto",
    marginLeft: ".325rem",
  },
  entryItemsContainer: {
    maxHeight: "50vh",
    overflowY: "auto",
  },
  root: {
    background: "#FAFAFA99",
    margin: "0 -8px -8px",
    padding: "0 1em 1em",
  },
  selectDisabled: {
    color: "#333",
  },
});

export default withStyles(styles)(EntryItems);

function vhTOpx(value) {
  const w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName("body")[0],
    y = w.innerHeight || e.clientHeight || g.clientHeight;

  const result = (y * value) / 100;
  return result;
}
