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
  };

  // Context Types
  static childContextTypes = {
    // components: PropTypes.object.isRequired,
    // settingsComponentObjects: PropTypes.object,
    // events: PropTypes.object,
    // selectors: PropTypes.object,
    // storeListener: PropTypes.object
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
        // filters: initialFilterState
      },
      // omit non stored attributes
      {data, selectedData, sort, layout}
    );

    const reducers = {
      data: DataReducer,
      selectedData: SelectedDataReducer,
      sort: SortReducer,
      layout: LayoutReducer,
      // filters: FilterReducer
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

    // Make sure data isn't stale
    // this.store.dispatch({type: "SET_DATA", data: props.data});
  }

  getChildContext() {
    return {
      // components: this.components,
      // settingsComponentObjects: this.settingsComponentObjects,
      // events: this.events,
      // selectors: this.selectors,
      // storeListener: this.storeListener
    };
  }

  UNSAFE_componentWillReceiveProps({data = []}) {
    this.store.dispatch({type: "SET_DATA", data});
  }

  render() {
    const {data, headers, cells, selectRows, ...rest} = this.props;
    return (
      <Provider context={this.tableContext} store={this.store}>
        <TableComponent
          data={data}
          headers={headers}
          cells={cells}
          context={this.tableContext}
          selectRows={selectRows}
          {...rest}
        />
      </Provider>
    );
  }
}
export default SearchableTable;
