import React from "react";
import PropTypes from "prop-types";
import deburr from "lodash/deburr";
import find from "lodash/find";

import Downshift from "downshift";
import {withStyles} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";

import ArrowDropDown from "@material-ui/icons/ArrowDropDown";

// Helper Functions
//------------------------------------------------------------------------------
function renderInput(inputProps, toggleBtnProps) {
  const {InputProps, classes, ref, value, ...other} = inputProps;

  const endAdornment = (
    <InputAdornment position="end">
      <IconButton {...toggleBtnProps}>
        <ArrowDropDown />
      </IconButton>
    </InputAdornment>
  );

  return (
    <TextField
      InputProps={{
        inputRef: ref,
        classes: {
          root: classes.inputRoot,
        },
        endAdornment,
        ...InputProps,
        value,
      }}
      {...other}
    />
  );
}

function renderSuggestion({
  suggestion,
  index,
  itemProps,
  highlightedIndex,
  selectedItem,
}) {
  const isHighlighted = highlightedIndex === index;
  const isSelected = (selectedItem || "").indexOf(suggestion.label) > -1;

  return (
    <MenuItem
      {...itemProps}
      key={suggestion.label}
      selected={isHighlighted}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 300,
        width: "100%",
        padding: ".25em .5em",
        fontSize: "1.125em",
        textAlign: "left",
      }}
    >
      {suggestion.label}
    </MenuItem>
  );
}
renderSuggestion.propTypes = {
  highlightedIndex: PropTypes.number,
  index: PropTypes.number,
  itemProps: PropTypes.object,
  selectedItem: PropTypes.string,
  suggestion: PropTypes.shape({label: PropTypes.string}).isRequired,
};

function getSuggestions(value, suggestions = []) {
  const inputValue = deburr(value.trim()).toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;

  return inputLength === 0
    ? []
    : suggestions.filter(suggestion => {
        const keep =
          count < 5 &&
          suggestion.label.slice(0, inputLength).toLowerCase() === inputValue;

        if (keep) {
          count += 1;
        }

        return keep;
      });
}

// Component
//------------------------------------------------------------------------------
const Autocomplete = ({
  classes = {},
  suggestions = [],
  renderSuggestion = renderSuggestion,
  getSuggestions = getSuggestions,
  paperStyles = {},
  ...rest
}) => {
  let popperNode;

  const selectedItem = find(suggestions, {id: rest.value}) || {};
  const {displayName: value} = selectedItem;

  const handleChange = value => {
    rest.onChange({
      target: {
        ...rest.inputProps,
        value,
        selectedItem: find(suggestions, {id: value}),
      },
    });
  };

  return (
    <Downshift
      {...{
        onChange: handleChange,
        // onSelect,
        // onInputValueChange,
      }}
    >
      {({
        getInputProps,
        getItemProps,
        getMenuProps,
        getToggleButtonProps,
        highlightedIndex,
        inputValue,
        isOpen,
        selectedItem,
      }) => {
        return (
          <div className={classes.container}>
            {renderInput(
              {
                fullWidth: true,
                classes,
                value,
                required: rest.required,
                InputProps: getInputProps({
                  ...rest,
                }),
                ref: node => {
                  popperNode = node;
                },
              },
              getToggleButtonProps()
            )}
            <div {...getMenuProps()}>
              {isOpen ? (
                <Popper disablePortal open={isOpen} anchorEl={popperNode}>
                  <Paper
                    className={classes.paper}
                    square
                    style={{
                      overflow: "hidden",
                      overflowY: "auto",
                      maxHeight: "350px",
                      ...paperStyles,
                    }}
                  >
                    {getSuggestions(inputValue, suggestions).map(
                      (suggestion, index) =>
                        renderSuggestion({
                          suggestion,
                          index,
                          itemProps: getItemProps({item: suggestion.id}),
                          highlightedIndex,
                          selectedItem,
                        })
                    )}
                  </Paper>
                </Popper>
              ) : null}
            </div>
          </div>
        );
      }}
    </Downshift>
  );
};

// PropTypes
//------------------------------------------------------------------------------
Autocomplete.propTypes = {
  classes: PropTypes.object.isRequired,
  paperStyles: PropTypes.object,
  suggestions: PropTypes.array.isRequired,
  renderSuggestion: PropTypes.func.isRequired,
  getSuggestions: PropTypes.func.isRequired,
};

// Styles
//------------------------------------------------------------------------------
const styles = theme => ({
  root: {
    flexGrow: 1,
    height: 250,
  },
  container: {
    flexGrow: 1,
    position: "relative",
  },
  paper: {
    position: "absolute",
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    width: "350px",
  },
  dropdown: {
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  dropdownItem: {
    width: "100%",
  },
  chip: {
    margin: `${theme.spacing(0.5)}px ${theme.spacing(0.25)}px`,
  },
  inputRoot: {
    flexWrap: "nowrap",

    "& input": {
      width: "100%",
    },

    "& button:hover": {
      backgroundColor: "transparent",
    },
    "& button:focus": {
      backgroundColor: "transparent",
    },
  },
  divider: {
    height: theme.spacing(2),
  },
});

// Export
//------------------------------------------------------------------------------
export default withStyles(styles)(Autocomplete);
