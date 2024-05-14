import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import {Select} from "formik-material-ui";
import {Field} from "formik";

// Icons
import FileIcon from "@material-ui/icons/InsertDriveFileOutlined";
import FileTypeIcon from "./file_type_icon";

import {makeStyles} from "@material-ui/core/styles";
const useStyles = makeStyles(() => ({
  item: {
    display: "flex",

    "& svg": {
      marginRight: 4,
    },
  },
  select: {
    "& > div": {
      paddingTop: 0,
      paddingBottom: 3,
      minHeight: 25,
    },
    "& div > svg": {
      position: "relative",
      top: 5,
    },
  },
}));
const FileTypeDropdown = (props) => {
  const classes = useStyles();
  return (
    <FormControl {...props} fullWidth style={{marginTop: 4}}>
      <InputLabel htmlFor="fileType">File Type</InputLabel>
      <Field
        component={Select}
        name="fileType"
        fullWidth
        className={classes.select}
      >
        <MenuItem value="" className={classes.item}>
          <FileIcon /> All Files
        </MenuItem>
        <MenuItem
          value="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className={classes.item}
        >
          <FileTypeIcon fileType="application/vnd.openxmlformats-officedocument.wordprocessingml.document" />
          Word
        </MenuItem>
        <MenuItem value="application/pdf" className={classes.item}>
          <FileTypeIcon fileType="application/pdf" />
          PDF
        </MenuItem>
        <MenuItem
          value="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          className={classes.item}
        >
          <FileTypeIcon fileType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" />
          Excel
        </MenuItem>
        <MenuItem
          value="application/vnd.openxmlformats-officedocument.presentationml.presentation"
          className={classes.item}
        >
          <FileTypeIcon fileType="application/vnd.openxmlformats-officedocument.presentationml.presentation" />
          PowerPoint
        </MenuItem>
        <MenuItem value="text" className={classes.item}>
          <FileTypeIcon fileType="text" />
          Plain Text
        </MenuItem>
        <MenuItem value="image" className={classes.item}>
          <FileTypeIcon fileType="image/" />
          Image
        </MenuItem>
      </Field>
    </FormControl>
  );
};

export default FileTypeDropdown;
