import {makeStyles} from "@material-ui/core/styles";
import FileIcon from "@material-ui/icons/DescriptionOutlined";
import ExcelIcon from "mdi-material-ui/FileExcelOutline";
import ImageIcon from "mdi-material-ui/FileImageOutline";
import PdfIcon from "mdi-material-ui/FilePdfOutline";
import PptIcon from "mdi-material-ui/FilePowerpointOutline";
import WordIcon from "mdi-material-ui/FileWordOutline";
import PropTypes from "prop-types";

const FileTypeIcon = ({fileType = "unknown", ...props}) => {
  const Icon = getIcon(fileType);
  const name = getFriendlyTypename(fileType);
  const classes = useStyles();

  return <Icon {...props} className={classes[name]} />;
};
FileTypeIcon.propTypes = {
  fileType: PropTypes.string,
};

export default FileTypeIcon;

function getIcon(filetype) {
  switch (filetype) {
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return WordIcon;
    case "application/pdf":
      return PdfIcon;
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      return ExcelIcon;
    case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      return PptIcon;
    case "application/vnd.ms-powerpoint":
      return PptIcon;
    default:
      break;
  }

  if (filetype.match(/image\//)) {
    return ImageIcon;
  }

  return FileIcon;
}

export function getFriendlyTypename(filetype) {
  switch (filetype) {
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return "Word";
    case "application/pdf":
      return "PDF";
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      return "Excel";
    case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      return "PowerPoint";
    case "application/vnd.ms-powerpoint":
      return "PowerPoint";
    default:
      break;
  }

  if (filetype.match(/text\//)) {
    return "Text";
  }

  if (filetype.match(/image\//)) {
    return "Image";
  }

  return filetype;
}

const useStyles = makeStyles(() => ({
  Word: {color: "#2D60BA"},
  PDF: {color: "#CC3634"},
  Excel: {color: "#3B7E4D"},
  PowerPoint: {color: "#B24428"},
  Image: {color: "#757575"},
}));
