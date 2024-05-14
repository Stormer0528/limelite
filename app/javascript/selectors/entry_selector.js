import {createSelector} from "reselect";
import {isNil, filter, isEmpty} from "lodash";

export const elementSelector = (filterValue, suggestions = []) =>
  createSelector(() => {
    if (isEmpty(filterValue) || isNil(filterValue)) {
      return suggestions;
    }

    return filter(suggestions, ({label = "", value = ""}) => {
      return label.indexOf(filterValue) >= 0 || value.indexOf(filterValue) >= 0;
    });
  })();
