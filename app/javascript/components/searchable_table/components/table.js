import PropTypes from "prop-types";
import {AutoSizer, InfiniteLoader} from "react-virtualized";
import TableBase from "./table_base";

const SearchableTable = ({
  containerProps = {},
  innerProps = {},
  fetchMore = function() {},
  rowCount = 999,
  ...rest
}) => {
  function isRowLoaded({index}) {
    return !!rest.data[index];
  }

  function loadMoreRows(indexes = {}) {
    fetchMore(indexes);
  }

  return (
    <section className="SearchableTable" {...containerProps}>
      <div className="SearchableTableInner" {...innerProps}>
        <InfiniteLoader {...{isRowLoaded, loadMoreRows, rowCount}}>
          {({onRowsRendered, registerChild}) => (
            <AutoSizer>
              {({height, width}) => (
                <TableBase
                  {...{...rest, height, width, onRowsRendered, registerChild}}
                />
              )}
            </AutoSizer>
          )}
        </InfiniteLoader>
      </div>
    </section>
  );
};

// PropTypes
//------------------------------------------------------------------------------
SearchableTable.propTypes = {
  /* Props to be passed to the outer <section> of the SearchableTable */
  containerProps: PropTypes.object,
  /* Props to be passed to the inner <div> of the SearchableTable */
  innerProps: PropTypes.object,
  /* An array of objects passed to each row */
  data: PropTypes.array,
  /* an array of strings - titles for each column */
  headers: PropTypes.array,
  /* an array of functions - render function for each cell */
  cells: PropTypes.array,
  /* total number of rows available on the server */
  rowCount: PropTypes.number,
  /* function to fetch additional data from the server */
  fetchMore: PropTypes.func,
};

export default SearchableTable;
