import Checkbox from "@material-ui/core/Checkbox";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import {withStyles} from "@material-ui/core/styles";
import clsx from "clsx";
import currency from "currency.js";
import {format} from "date-fns/esm";
import {useFormikContext} from "formik";
import MuiTable from "mui-virtualized-table";
import PropTypes from "prop-types";
import {useState, useCallback} from "react";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";

const createSortWorker = () => new Worker("./sort.worker", {type: "module"});
const ChecksTable = ({
  itemsKey = "checkedItems",
  setItems = function () {},
  items = [],
  classes = {},
}) => {
  const {
    values: {[itemsKey]: checkedItems = {}},
    handleChange,
    setFieldTouched,
  } = useFormikContext();

  const [sort, setSort] = useState({name: "number", direction: "desc"});
  const handleSortChange = useCallback(
    (updatedSort) => {
      setSort(updatedSort);
      const sortWorker = createSortWorker();
      sortWorker.onmessage = function ({data: items}) {
        setItems(items);
        sortWorker.terminate();
      };

      sortWorker.postMessage({items, sort: updatedSort, checkedItems});
    },
    [items, checkedItems, setItems]
  );

  const handleHeaderClick = ({name}) => {
    const direction =
      name !== sort.name ? "desc" : sort.direction === "asc" ? "desc" : "asc";

    handleSortChange({name, direction});
  };

  return (
    <Paper className={clsx(classes.root, "react-inputs")}>
      <AutoSizer>
        {({width, height}) => (
          <MuiTable
            onHeaderClick={handleHeaderClick}
            orderBy={sort.name}
            orderDirection={sort.direction}
            data={items}
            columns={[
              {
                name: "check",
                header: "",
                cell: CheckCell({checkedItems, itemsKey, handleChange}),
                cellProps: {style: {padding: "0", width: "45px"}},
                width: 45,
              },
              {
                name: "number",
                header: "NO.",
                cellProps: {style: {padding: "0 .35rem", width: "102px"}},
                cell: NumberCell({
                  checkedItems,
                  itemsKey,
                  handleChange,
                  setFieldTouched,
                }),
                width: 100,
              },
              {
                name: "date",
                header: "DATE",
                cell: DateCell,
                cellProps: {style: {padding: "0 .35rem", width: "85px"}},
                width: 85,
              },
              {
                name: "amount",
                header: "AMOUNT",
                cell: AmountCell,
                cellProps: {
                  style: {
                    padding: "0 .35rem",
                    width: "125px",
                    textAlign: "right",
                  },
                },
                width: 125,
              },
              {name: "payee", header: "PAYEE"},
              {name: "memo", header: "MEMO"},
            ]}
            width={width}
            maxHeight={height}
            includeHeaders={true}
            fixedRowCount={1}
            style={{backgroundColor: "white"}}
            cellProps={(column, {id}) => {
              return !!checkedItems[id] ? {className: classes.selectedRow} : {};
            }}
          />
        )}
      </AutoSizer>
    </Paper>
  );
};

ChecksTable.propTypes = {
  itemsKey: PropTypes.string,
  setItems: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      date: PropTypes.string,
      amount: PropTypes.string,
      payee: PropTypes.string,
      memo: PropTypes.string,
    })
  ),
  classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
  root: {
    minHeight: "380px",
    flexGrow: 1,
  },
  selectedRow: {
    backgroundColor: "#ECEFF1",
    borderBottomColor: "#c3cdd3",
    display: "flex",
    boxSizing: "border-box",
    alignItems: "center",
  },
});

export default withStyles(styles)(ChecksTable);

// Columns
//------------------------------------------------------------------------------
const CheckCell =
  ({handleChange, checkedItems, itemsKey}) =>
  (props) => {
    const {id, number: initialNumber} = props;
    const {[id]: {number: updatedNumber} = {}} = checkedItems;

    const checked = id in checkedItems;
    const disabled = !(initialNumber || updatedNumber);

    const onClick = (e) => {
      e.preventDefault();

      if (!checked) {
        handleChange({
          ...e,
          target: {name: `${itemsKey}.${id}`, value: props},
        });
      } else {
        const {[id]: _currentItem, ...restItems} = checkedItems;
        handleChange({...e, target: {name: itemsKey, value: restItems}});
      }
    };
    return <Checkbox {...{onClick, disabled, checked, color: "primary"}} />;
  };

const DateCell = function ({date}) {
  return format(date, "MM/dd/yyyy");
};

const AmountCell = function ({amount}) {
  return currency(amount).format(true);
};

const NumberCell =
  ({checkedItems, handleChange, setFieldTouched, itemsKey}) =>
  (props) => {
    const {id, number: initialNumber} = props;
    const {[id]: {number: updatedNumber} = {}} = checkedItems;
    const checked = id in checkedItems;

    const onChange = (e) => {
      const {
        target: {value: newVal},
      } = e;

      setFieldTouched(itemsKey);

      handleChange({
        ...e,
        target: {
          name: `${itemsKey}.${id}`,
          value: {...props, number: newVal || ""},
        },
      });
    };

    return (
      <TextField
        value={(checked ? updatedNumber : initialNumber) || ""}
        onChange={onChange}
        inputProps={{
          style: {fontSize: ".795rem"},
        }}
      />
    );
  };
