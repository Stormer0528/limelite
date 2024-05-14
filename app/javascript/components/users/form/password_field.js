import PropTypes from "prop-types";
import {useState, Fragment} from "react";
import {withStyles} from "@material-ui/core/styles";

import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormHelperText from "@material-ui/core/FormHelperText";
import TextField from "@material-ui/core/TextField";

import checkPw from "zxcvbn";

import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

const PasswordField = ({
  label = "",
  value = "",
  scoreWords = ["very low", "low", "medium", "good", "strong"],
  minScore = 2,
  minLength = 8,
  autoComplete = "off",
  required = true,
  fullWidth = false,
  field: {
    name = "password",
    onBlur = function () {},
    onChange = function () {},
    value: fieldValue = "",
  },

  classes = {},
  ...rest
}) => {
  // console.log("PasswordField ...rest", rest);
  const initialValue = fieldValue || value || "";
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState(false);
  const handleBtnClick = () => {
    setShowPassword(!showPassword);
  };

  const [
    {
      password = initialValue,
      score = 0,
      feedback: {warning = "", suggestions = []} = {value},
    },
    setPasswordCheckValue,
  ] = useState({});

  const handleChange = ({target: {value} = {}}) => {
    if (value.length <= minLength) {
      setTouched(true);
      setPasswordCheckValue({
        password: value,
        score: 0,
        feedback: {warning: "password is too short"},
      });
    } else {
      setTouched(true);
      setPasswordCheckValue(checkPw(value));
    }
    onChange({target: {name, value}});
  };

  const isValid = password.length >= minLength && score >= minScore;

  return (
    <Fragment>
      <TextField
        label={label}
        name={name}
        value={password}
        onBlur={onBlur}
        onChange={handleChange}
        required={required}
        error={touched && !isValid}
        fullWidth={fullWidth}
        aria-describedby="password-warning"
        className={classes.root}
        autoComplete={autoComplete}
        type={showPassword ? "text" : "password"}
        InputLabelProps={{shrink: true}}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleBtnClick}>
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      {password && (
        <FormHelperText
          id="password-strength-indicator"
          className={classes.strength}
        >
          <b>Strength:&nbsp;</b>
          <span className={classes[`score-${score}`]}>{scoreWords[score]}</span>
        </FormHelperText>
      )}
      {warning && (
        <FormHelperText id="password-warning" className={classes.warning}>
          <b>Warning:&nbsp;</b>
          {warning}
        </FormHelperText>
      )}
      {suggestions.map((text, i) => {
        return (
          <FormHelperText
            id={`pw-suggestion-${i}`}
            key={`pw-suggestion-${i}`}
            className={classes.suggestion}
          >
            <li>{text}</li>
          </FormHelperText>
        );
      })}
    </Fragment>
  );
};

PasswordField.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  fullWidth: PropTypes.bool,
  required: PropTypes.bool,
  value: PropTypes.string,
  minScore: PropTypes.number,
  minLength: PropTypes.number,
  autoComplete: PropTypes.string,
  scoreWords: PropTypes.arrayOf(PropTypes.string),
  classes: PropTypes.object.isRequired,
  field: PropTypes.shape({
    name: PropTypes.string,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    value: PropTypes.string,
  }),
};

const styles = (theme) => ({
  root: {},
  warning: {
    color: "#D32F2F",
    padding: ".5em 0",
    fontSize: ".9rem",

    lineHeight: ".75",
    margin: 0,

    "& b": {color: "#B71C1C"},
  },

  strength: {
    display: "flex",
    color: "#333 !important",
    padding: ".5em 0",
    fontSize: ".9rem",

    lineHeight: ".75",
    margin: 0,

    "& b": {color: "#111 !important"},
    "& span": {
      textTransform: "capitalize",
      textAlign: "right",
      display: "inline-block",
      flexGrow: "1",
      fontWeight: "500",
    },
  },
  "score-0": {color: "#D84315 !important"},
  "score-1": {color: "#f44336 !important"},
  "score-2": {color: "#FF9800 !important"},
  "score-3": {color: "#7CB342 !important"},
  "score-4": {color: "#1B5E20 !important"},

  suggestion: {
    color: "#607d8b !important",
    fontStyle: "italic",
    padding: ".25em 0",
  },
});

export default withStyles(styles)(PasswordField);
