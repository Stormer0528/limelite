import SortIndicatorIcon from "@material-ui/icons/ArrowDropUp";

const DefaultHeader = ({handleHeaderClick = function() {}}) => ({
  columnData,
  dataKey,
  disableSort,
  label,
  sortBy,
  sortDirection,
}) => {
  const showSortIndicator = sortBy === dataKey;
  const rotation = sortDirection === "ASC" ? "0" : "180";
  const handleClick = e => {
    handleHeaderClick(e, {
      columnData,
      dataKey,
      disableSort,
      label,
      sortBy,
      sortDirection,
    });
  };

  return (
    <div onClick={handleClick}>
      <span
        className="ReactVirtualized__Table__headerTruncatedText"
        key="label"
        title={typeof label === "string" ? label : null}
      >
        {label}
      </span>
      {showSortIndicator && (
        <SortIndicatorIcon
          key="SortIndicator"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: "transform .125s ease-out",
          }}
        />
      )}
    </div>
  );
};

export default DefaultHeader;
