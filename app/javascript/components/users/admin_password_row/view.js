import TextField from "@material-ui/core/TextField";
import PasswordField from "./password_field";

const View = () => {
  return (
    <div className="row react-inputs">
      <div className="col s6">
        <PasswordField name="user[password]" required fullWidth />
      </div>
      <div className="col s6">
        <TextField
          required
          fullWidth
          id="password_confirmation"
          label="Password Confirmation"
          name="user[password_confirmation]"
          type="password"
        />
      </div>
    </div>
  );
};

// const styles = (theme) => ({});

export default View;
