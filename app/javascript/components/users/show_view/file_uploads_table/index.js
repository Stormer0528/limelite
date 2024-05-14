import {Formik} from "formik";
import Table from "./table";

const FileUploadsTable = () => {
  return (
    <Formik initialValues={{filetype: "", description: ""}}>
      {(props) => <Table {...props} />}
    </Formik>
  );
};

export default FileUploadsTable;
