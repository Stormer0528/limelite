import {sortItems} from "../../shared/sort_funcs";

addEventListener("message", ({data: {items, sort, checkedItems}}) => {
  const updatedItems = items.map((item) => {
    const {number: updatedNumber} = checkedItems[item.id] || {};
    return {...item, number: updatedNumber || item.number};
  });

  postMessage(sortItems(updatedItems, sort));
});
