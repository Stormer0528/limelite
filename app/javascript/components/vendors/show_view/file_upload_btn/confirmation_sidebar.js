import UPDATE_FILE_UPLOAD_MUTATION from "../../../../graphql/mutations/update_file_upload.gql";
import FileTypeIcon, {
  getFriendlyTypename,
} from "../file_uploads_table/file_type_icon";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Drawer from "@material-ui/core/Drawer";
import Grow from "@material-ui/core/Grow";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import SvgIcon from "@material-ui/core/SvgIcon";
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import UploadSuccessIcon from "@material-ui/icons/CloudDoneOutlined";
import UploadErrorIcon from "@material-ui/icons/CloudOffOutlined";
import SaveIcon from "@material-ui/icons/Save";
import Alert from "@material-ui/lab/Alert";
import {mdiFileAlertOutline} from "@mdi/js";
import clsx from "clsx";
import {Field, Formik} from "formik";
import {TextField} from "formik-material-ui";
import PropTypes from "prop-types";
import {useState} from "react";
import {useMutation} from "react-apollo";

const FileErrorIcon = (props) => (
  <SvgIcon {...props}>
    <path d={mdiFileAlertOutline} />
  </SvgIcon>
);

const ConfirmationSidebar = ({
  open = false,
  onClose,
  filesFailed = [],
  filesUploaded = [],
}) => {
  const [alertOpen, setAlertOpen] = useState(true);
  const [saveFileUpload] = useMutation(UPDATE_FILE_UPLOAD_MUTATION);

  const classes = useStyles();
  return (
    <Drawer open={open} anchor="right" onClose={onClose}>
      <div style={{width: "50vw"}}>
        <Typography
          variant="h6"
          component="h3"
          className={clsx(classes.header, "success")}
        >
          <UploadSuccessIcon />
          <span className="text">Successfully Uploaded Files</span>
        </Typography>
        <Grow in={alertOpen}>
          <Alert
            className={clsx(classes.alert, {closed: !alertOpen})}
            severity="info"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setAlertOpen(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            <b>Your files are uploaded.</b>
            <br />
            You can change the descriptions here for better identification and
            searchability.
          </Alert>
        </Grow>
        <Formik
          initialValues={{filesUploaded}}
          onSubmit={({filesUploaded: values = []}, {setSubmitting}) => {
            values.forEach(({id, description}, i) => {
              if (description !== filesUploaded[i]["description"]) {
                saveFileUpload({
                  variables: {
                    fileUpload: {id, description},
                  },
                });
              }
            });

            setSubmitting(false);
            onClose();
          }}
        >
          {({handleSubmit, dirty}) => (
            <List>
              {filesUploaded.map((item, i) => {
                return (
                  <ListItem key={`${item.id}-${i}`}>
                    <UploadedItem {...item} i={i} />
                  </ListItem>
                );
              })}

              <div className={classes.btnContainer}>
                <Button
                  disabled={dirty}
                  color="primary"
                  startIcon={<CloseIcon />}
                  fullWidth
                  onClick={onClose}
                >
                  Close
                </Button>
                <Button
                  disabled={!dirty}
                  fullWidth
                  onClick={handleSubmit}
                  startIcon={<SaveIcon />}
                >
                  Update Files
                </Button>
              </div>
            </List>
          )}
        </Formik>

        {filesFailed.length > 0 && (
          <div>
            <Typography
              variant="h6"
              component="h3"
              className={clsx(classes.header, "error")}
            >
              <UploadErrorIcon />
              <span className="text">Failed File Uploads</span>
            </Typography>
            <List>
              {filesFailed.map((item, i) => {
                return (
                  <ListItem
                    key={item.filename + i}
                    className={classes.errorListItem}
                  >
                    <ListItemIcon>
                      <FileErrorIcon />
                    </ListItemIcon>
                    {item.filename}
                  </ListItem>
                );
              })}
            </List>
          </div>
        )}
      </div>
    </Drawer>
  );
};

const UploadedItem = ({i, fileType, filename}) => {
  const cl = useCardStyles();
  return (
    <Card className={cl.root} elevation={0}>
      <CardHeader
        avatar={
          <Avatar className={cl.avatar}>
            <FileTypeIcon {...{fileType}} />
          </Avatar>
        }
        title={<h3 className={cl.fileNameTitle}>{filename}</h3>}
        subheader={
          <div>
            {getFriendlyTypename(fileType) !== fileType && (
              <b className={cl.simpleFileType}>
                {getFriendlyTypename(fileType)}&nbsp;File
              </b>
            )}
            {getFriendlyTypename(fileType) === fileType && (
              <div className={cl.fullFileType}>{fileType}</div>
            )}
          </div>
        }
      />

      <CardContent className={cl.content}>
        <Field
          fullWidth
          component={TextField}
          label="Description"
          margin="dense"
          name={`filesUploaded.${i}.description`}
          inputProps={{
            className: "browser-default",
          }}
        />
      </CardContent>
    </Card>
  );
};
const useCardStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    border: "2px solid #E0E0E0",
    boxShadow: "0 0 5px rgba(125, 125, 125, 0.05)",
  },
  avatar: {backgroundColor: "#f5f5f5"},
  fileNameTitle: {
    margin: 0,
  },
  simpleFileType: {},
  fullFileType: {
    fontSize: ".9em",
    color: "#ccc",
  },
  content: {
    paddingLeft: "74px",
  },
}));

const useStyles = makeStyles((theme) => ({
  header: {
    display: "grid",
    gridTemplateColumns: "repeat(2, max-content)",
    placeContent: "center",
    alignItems: "center",
    gridColumnGap: 4,
    padding: ".5em 0",
    border: "1px solid",
    borderWidth: "1px 0",

    "&.success": {
      backgroundColor: "#DCEDC8",
      borderColor: "#C5E1A5",
      color: "#33691E",
    },

    "&.error": {
      marginTop: "2em",
      color: "#F44336",
      backgroundColor: "#FFEBEE",
      borderColor: "#FFCDD2",
    },
  },
  btnContainer: {
    borderTop: "1px solid #f0f0f0",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    paddingTop: 16,
  },
  alert: {
    height: 78,

    transition: "height 226ms cubic-bezier(0.4, 0, 0.2, 1)",

    "&.closed": {
      height: 0,
    },
  },
  listItem: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gridColumnGap: 8,
    border: "3px solid #f0f0f0",
    borderRadius: "3px",
    width: "auto",
    margin: theme.spacing(1),
  },
  errorListItem: {
    borderBottom: "1px solid #eee",
  },
  descriptionRow: {
    gridColumn: "1 / 3",
  },
  filetypeString: {
    color: "#ccc",
    fontSize: ".75em",
  },
}));

ConfirmationSidebar.propTypes = {
  open: PropTypes.bool,
  filesFailed: PropTypes.array,
  filesUploaded: PropTypes.array,
  onClose: PropTypes.func,
};

export default ConfirmationSidebar;
