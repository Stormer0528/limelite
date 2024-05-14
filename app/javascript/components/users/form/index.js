import PropTypes from "prop-types";
import {Fragment, useState, useCallback} from "react";
import {Formik, Form, Field} from "formik";
import {makeStyles} from "@material-ui/core/styles";
import clsx from "clsx";
import {useMutation} from "@apollo/react-hooks";
import UPDATE_USER_PREFRENCES_QUERY from "@graphql/mutations/update_user_preferences";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import InputAdornment from "@material-ui/core/InputAdornment";
import {TextField} from "formik-material-ui";

import AccountIcon from "@shared/icons/account_icon";
import DepartmentIcon from "@shared/icons/department_icon";
import UserGroupIcon from "@shared/icons/user_group_icon";

import EmailIcon from "@material-ui/icons/MailOutlineOutlined";
import SaveIcon from "@material-ui/icons/Save";

import FilestackImageUploadBtn from "../../shared/filestack_image_upload_btn";
import PasswordField from "./password_field";
import HiddenInputs from "../show_view/hidden_inputs";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";

const UserForm = ({
  user = {
    department: {account: {}},
    emailPreference: "summary",
  },
  readOnly = false,
  disabled: formDisabled = false,
  hidePassword,
  onSubmit = function () {},
  user: {avatarUrl = ""} = {},
  style,
}) => {
  const classes = useStyles();
  const handleSubmit = () => {
    document.querySelector("form#user_info_form").submit();
  };
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const handleHidePassBtnClick = useCallback(
    (e) => {
      e.preventDefault();
      setIsPasswordHidden(hidePassword === true ? true : !isPasswordHidden);
    },
    [hidePassword, isPasswordHidden]
  );

  const [emailPreference, setEmailPreference] = useState(
    user.emailPreference || "summary"
  );
  const [updateUserPrefrences] = useMutation(UPDATE_USER_PREFRENCES_QUERY);
  const handleEmailChange = (e, value) => {
    setEmailPreference(value);
    updateUserPrefrences({
      variables: {emailPreference: value},
    });
  };

  return (
    <section className={clsx(classes.root, "react-inputs")} style={style}>
      <Formik
        initialValues={user}
        validateOnChange={false}
        isInitialValid
        onSubmit={onSubmit}
      >
        {({isSubmitting, values}) => {
          const disabled = formDisabled || isSubmitting;
          return (
            <Fragment>
              <Grid
                container
                className={classes.container}
                spacing={2}
                data-cy="user-details-table"
              >
                <Grid item sm={1}>
                  <FilestackImageUploadBtn value={avatarUrl} />
                </Grid>
                <Grid item sm={3}>
                  <Field
                    required
                    fullWidth
                    component={TextField}
                    disabled={disabled}
                    InputProps={{readOnly}}
                    name="firstName"
                    type="text"
                    label="First Name"
                  />
                </Grid>
                <Grid item sm={3}>
                  <Field
                    required
                    fullWidth
                    component={TextField}
                    disabled={disabled}
                    InputProps={{readOnly}}
                    name="lastName"
                    type="text"
                    label="Last Name"
                  />
                </Grid>
                <Grid item sm={5}>
                  <Field
                    required
                    fullWidth
                    component={TextField}
                    disabled={disabled}
                    name="email"
                    type="email"
                    label="Email"
                    InputProps={{
                      readOnly,
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>

              <Grid container className={classes.container} spacing={2}>
                <Grid item xs={6} sm={4}>
                  <FormControl component="fieldset" disabled={false}>
                    <FormLabel component="legend">Email Preferences</FormLabel>
                    <RadioGroup
                      aria-label="email_preferences"
                      name="email_preferences"
                      value={emailPreference}
                      onChange={handleEmailChange}
                    >
                      <FormControlLabel
                        value="all"
                        control={<Radio />}
                        label="Every Authorization"
                      />
                      <FormControlLabel
                        value="summary"
                        control={<Radio />}
                        label="Weekly Summary"
                      />
                      <FormControlLabel
                        value="none"
                        control={<Radio />}
                        label="None"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                <Grid item xs={6} sm={4}>
                  <Field
                    required
                    fullWidth
                    component={TextField}
                    disabled={disabled}
                    name="currentUserGroup.name"
                    label="User Group"
                    InputProps={{
                      readOnly,
                      startAdornment: (
                        <InputAdornment position="start">
                          <UserGroupIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                {user.department && (
                  <Grid item xs={6} sm={4}>
                    <Field
                      required
                      fullWidth
                      component={TextField}
                      disabled={disabled}
                      name="department.name"
                      label="Department"
                      InputProps={{
                        readOnly,
                        startAdornment: (
                          <InputAdornment position="start">
                            <DepartmentIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                )}
                {user.department && user.department.account && (
                  <Grid item xs={6} sm={4}>
                    <Field
                      required
                      fullWidth
                      component={TextField}
                      disabled={disabled}
                      name="department.account.name"
                      helperText={user.department.account.number}
                      label="Account"
                      InputProps={{
                        readOnly,
                        startAdornment: (
                          <InputAdornment position="start">
                            <AccountIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                )}
              </Grid>
              {!hidePassword && (
                <Grid container className={classes.container} spacing={2}>
                  <Grid item>
                    <Button onClick={handleHidePassBtnClick}>
                      {`${isPasswordHidden ? "Edit" : "Hide"}`} Password
                    </Button>
                  </Grid>
                  {!isPasswordHidden && (
                    <Fragment>
                      <Grid item sm={4}>
                        <Field
                          required
                          fullWidth
                          component={PasswordField}
                          disabled={disabled}
                          InputProps={{readOnly}}
                          name="password"
                          type="password"
                          label="Password"
                        />
                      </Grid>
                      <Grid item sm={4}>
                        <Field
                          required
                          fullWidth
                          component={TextField}
                          disabled={disabled}
                          InputProps={{readOnly}}
                          name="password_confirmation"
                          type="password"
                          label="Password Confirmation"
                        />
                      </Grid>
                    </Fragment>
                  )}
                </Grid>
              )}
              <Form id="user_info_form">
                {!formDisabled && !readOnly && (
                  <Grid
                    container
                    className={clsx(
                      classes.container,
                      classes.submitBtnContainer
                    )}
                    spacing={2}
                  >
                    <Grid item>
                      <Button
                        startIcon={<SaveIcon />}
                        type="submit"
                        fullWidth
                        variant="outlined"
                        onClick={handleSubmit}
                        className={classes.submitBtn}
                      >
                        Update
                      </Button>
                    </Grid>
                  </Grid>
                )}
                <HiddenInputs values={values} />
              </Form>
            </Fragment>
          );
        }}
      </Formik>
    </section>
  );
};

UserForm.propTypes = {
  isInitialValid: PropTypes.bool,
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool,
  hideSubmissionBar: PropTypes.bool,
  hidePassword: PropTypes.bool,
  onSubmit: PropTypes.func,
  user: PropTypes.shape({avatarUrl: PropTypes.string}),
  style: PropTypes.object,
};

const useStyles = makeStyles((theme) => ({
  container: {
    marginBottom: "1rem",
    borderTop: "1px solid #E0E0E0",
  },
  submitBtn: {
    width: "45vw",
    margin: "auto",
  },
  submitBtnContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderTop: "1px solid #E0E0E0",
    paddingTop: ".75em",
  },
  root: {
    // Adjust color to be more readable
    "&.react-inputs input[disabled][readonly]": {
      color: "#333",
    },
  },
}));

export default UserForm;
