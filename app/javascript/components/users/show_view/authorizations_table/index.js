import PropTypes from "prop-types";
import {Formik} from "formik";
import Table from "./table";

const FileUploadsTable = ({items}) => {
  return (
    <Formik initialValues={{filetype: "", description: ""}}>
      {(props) => <Table {...props} {...{items}} />}
    </Formik>
  );
};

FileUploadsTable.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object),
};

export default FileUploadsTable;
