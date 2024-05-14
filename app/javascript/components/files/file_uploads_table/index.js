import Table from "./table";
import {Formik} from "formik";

const FileUploadsTable = ({organizationId}) => {
  return (
    <Formik initialValues={{filetype: "", description: "", archived: false}}>
      {(props) => <Table organizationId={organizationId} {...props} />}
    </Formik>
  );
};

export default FileUploadsTable;
