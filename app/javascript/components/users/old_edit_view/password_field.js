import PropTypes from "prop-types";
import {useState} from "react";
import {withStyles} from "@material-ui/core/styles";

import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import MUIPasswordField from "material-ui-password-field";
import checkPw from "zxcvbn";

const PasswordField = ({
  value = "",
  scoreWords = ["very low", "low", "medium", "good", "strong"],
  minScore = 2,
  minLength = 8,
  autoComplete = "off",
  required = true,
  fullWidth = false,
  name = "password",
  id = "password",
  classes = {},
}) => {
  const [touched, setTouched] = useState(false);
  const [
    {
      password = "",
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
  };

  const isValid = password.length >= minLength && score >= minScore;

  return (
    <FormControl
      required={required}
      error={touched && !isValid}
      fullWidth={fullWidth}
    >
      <InputLabel htmlFor="password">Password</InputLabel>
      <MUIPasswordField
        id={id}
        name={name}
        value={password}
        onChange={handleChange}
        required={required}
        aria-describedby="password-warning"
        autoComplete={autoComplete}
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
    </FormControl>
  );
};

PasswordField.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  fullWidth: PropTypes.bool,
  required: PropTypes.bool,
  value: PropTypes.string,
  minScore: PropTypes.number,
  minLength: PropTypes.number,
  autoComplete: PropTypes.string,
  scoreWords: PropTypes.arrayOf(PropTypes.string),
  classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
  root: {},
  warning: {
    color: "#D32F2F",
    padding: ".5em 0",
    fontSize: ".9rem",

    "& b": {color: "#B71C1C"},
  },

  strength: {
    display: "flex",
    color: "#333 !important",
    padding: ".5em 0",
    fontSize: ".9rem",

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
