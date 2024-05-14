import {findIndex} from "lodash";

export default function removeItem(group, id) {
  const index = findIndex(group, {id});
  return index < 0
    ? group
    : group.slice(0, index).concat(group.slice(index + 1));
}
