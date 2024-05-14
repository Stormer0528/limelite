/**
 * Displays field errors for fields that have been touched and have errors set
 * You will need both setFieldTouched and setFieldError
 *
 * @messages can be array, string or object
 */

import {Fragment} from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import Fade from "@material-ui/core/Fade";
import {ErrorMessage} from "formik";
import {titleCase} from "humanize-plus";
import {withStyles} from "@material-ui/core/styles";
import decamelize from "decamelize";
import isArray from "lodash/isArray";
import isString from "lodash/isString";
import isNull from "lodash/isNull";
import compact from "lodash/compact";

const titleize = (str = "") => titleCase(decamelize(str).replace(/[-_]/g, " "));

const ErrorMessageList = ({
  name,
  ignoredKeys = [],
  allowedKeys = [],
  classes = {},
}) => {
  return (
    <ErrorMessage name={name}>
      {(messages = []) => {
        /* Handle String */
        if (isString(messages)) {
          return (
            <Fade in>
              <div className={clsx(classes.root, classes.item)}>{messages}</div>
            </Fade>
          );

          /* Handle Array */
        } else if (isArray(messages)) {
          return (
            <Fade in>
              <ul className={`${classes.root} browser-default`}>
                {messages.map((msg, i) => (
                  <li key={i} className={classes.item}>
                    {msg}
                  </li>
                ))}
              </ul>
            </Fade>
          );
        }

        /* handle function */
        if (typeof messages.map === "function") {
          return (
            <Fade in>
              <ul className={`${classes.root} browser-default`}>
                {messages.map((msg, i) => (
                  <li key={i} className={classes.item}>
                    {msg}
                  </li>
                ))}
              </ul>
            </Fade>
          );
        }

        /* Handle Object */
        if (typeof messages === "object") {
          const filteredMessages = Object.entries(messages)
            .filter(([field]) => !ignoredKeys.includes(field))
            .filter(
              ([field]) => !allowedKeys.length || allowedKeys.includes(field)
            );

          return !filteredMessages.length ? null : (
            <Fade in>
              <ul className={`${classes.root} browser-default`}>
                {filteredMessages.map(([field, msg], i) => {
                  return (
                    <li key={i} className={classes.item}>
                      <b>{titleCase(titleize(field, " "))}:</b>{" "}
                      {isString(msg) && msg}
                      {!isString(msg) && objectToList(compact(msg))}
                    </li>
                  );
                })}
              </ul>
            </Fade>
          );
        }
        return `${messages}`;
      }}
    </ErrorMessage>
  );
};

const objectToList = (error) => {
  if (isNull(error)) {
    return null;
  }
  if (isString(error)) {
    return error;
  } else if (isArray(error)) {
    return (
      <ul>
        {compact(error).map((err, i) => (
          <li key={i}>{objectToList(err)}</li>
        ))}
      </ul>
    );
  } else if (typeof error === "object") {
    return (
      <ul>
        {Object.entries(error).map(([k, v]) => (
          <Fragment key={k}>
            {isString(v) && (
              <li key={k}>
                <b>{titleize(k)}:</b>&nbsp;{v}
              </li>
            )}
            {!isString(v) && objectToList(v)}
          </Fragment>
        ))}
      </ul>
    );
  }
};

ErrorMessageList.propTypes = {
  name: PropTypes.string,
  ignoredKeys: PropTypes.arrayOf(PropTypes.string),
  allowedKeys: PropTypes.arrayOf(PropTypes.string),
  classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
  root: {
    padding: "0",
  },
  item: {
    listStyle: "none",
    color: "#B71C1C",
    background: "#FCE4EC",
    padding: ".25em 1em",
    margin: ".25rem 0",
  },
});

export default withStyles(styles)(ErrorMessageList);
