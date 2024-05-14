import PropTypes from "prop-types";
import {createStore, combineReducers, compose} from "redux";
import {Provider} from "react-redux";
import {Component} from "react";

/* Reducers */
import DataReducer, {
  defaultState as initialDataState,
} from "./reducers/data_reducer";

import SelectedDataReducer, {
  defaultState as initialSelectedDataState,
} from "./reducers/selected_data_reducer";

import SortReducer, {
  defaultState as initialSortState,
} from "./reducers/sort_reducer";

import LayoutReducer, {
  defaultState as initialLayoutState,
} from "./reducers/layout_reducer";

/* Components */
import TableComponent from "./components/table_container";

class SearchableTable extends Component {
  // PropTypes
  static propTypes = {
    data: PropTypes.array.isRequired,
    headers: PropTypes.array.isRequired,
    cells: PropTypes.array.isRequired,
    selectRows: PropTypes.bool,
    selectedData: PropTypes.array,
    sort: PropTypes.string,
    layout: PropTypes.node,
    handleHeaderClick: PropTypes.func,
    height: PropTypes.number,
  };

  constructor(props) {
    super(props);

    // Get Initial State
    const {data, selectedData, sort, layout} = props;
    const initialState = Object.assign(
      {},
      {
        data: initialDataState,
        selectedData: initialSelectedDataState,
        sort: initialSortState,
        layout: initialLayoutState,
      },
      // omit non stored attributes
      {data, selectedData, sort, layout}
    );

    const reducers = {
      data: DataReducer,
      selectedData: SelectedDataReducer,
      sort: SortReducer,
      layout: LayoutReducer,
    };

    // Create Store
    const composeEnhancers =
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    this.store = createStore(
      combineReducers(reducers),
      initialState,
      composeEnhancers()
    );

    // Create Provider
    this.tableContext = React.createContext();
  }
  UNSAFE_componentWillReceiveProps({data = []}) {
    this.store.dispatch({type: "SET_DATA", data});
  }

  render() {
    const {
      data,
      headers,
      cells,
      selectRows,
      handleHeaderClick,
      ...rest
    } = this.props;
    return (
      <Provider context={this.tableContext} store={this.store}>
        <TableComponent
          {...{
            data,
            headers,
            cells,
            selectRows,
            handleHeaderClick,
          }}
          context={this.tableContext}
          {...rest}
        />
      </Provider>
    );
  }
}
export default SearchableTable;
