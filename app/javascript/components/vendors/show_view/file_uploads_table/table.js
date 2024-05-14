import {Fragment} from "react";
import PropTypes from "prop-types";
import {useQuery} from "react-apollo";
import {useFormikContext} from "formik";
import {useCurrentRoute} from "react-navi";

import {useDebounce} from "@react-hook/debounce";
import isEqual from "react-fast-compare";

import IconButton from "@material-ui/core/IconButton";
import DownloadIcon from "@material-ui/icons/GetApp";
import Filter from "./filter";
import FileTypeIcon, {getFriendlyTypename} from "./file_type_icon";
import FILE_UPLOADS_QUERY from "../../../../graphql/queries/file_uploads.gql";

// Components
import SearchableTable from "searchable_table/searchable_table";
import DateRenderer from "searchable_table/components/defaults/date_column";
import TextRenderer from "searchable_table/components/defaults/text_column";

const FileUploadsTable = () => {
  const {values: formValues = {}} = useFormikContext();
  const {data: {filestack: {security = {}} = {}} = {}} = useCurrentRoute();
  const [savedValues, setSavedValues] = useDebounce({
    description: "",
    fileType: "",
  });

  if (!isEqual(formValues, savedValues)) {
    setSavedValues(formValues);
  }

  const {data: {fileUploadSearchConnection: {fileUploads = []} = {}} = {}} =
    useQuery(FILE_UPLOADS_QUERY, {
      fetchPolicy: "cache-and-network",
      variables: {
        payableType: "Vendor",
        payableId: "",
        ...savedValues,
      },
    });

  const formattedFileUploads = fileUploads.map((upload) => {
    const {updatedAt: date} = upload;
    const updatedDate = date.split(" ")[0];

    return {...upload, updatedAt: updatedDate};
  });

  return (
    <Fragment>
      <Filter />
      <SearchableTable
        data={formattedFileUploads}
        headers={["Type", "Description", "Date Added", ""]}
        cells={[
          FileTypeColumn,
          TextRenderer("description", {
            columnWidth: 250,
            flexGrow: 3,
          }),
          DateRenderer("updatedAt", {flexGrow: 0, columnWidth: 115}),
          DownloadLinkColumn(security),
        ]}
      />
    </Fragment>
  );
};

FileUploadsTable.propTypes = {
  fileUploads: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool,
};

const FileTypeColumn = ({rowData: {fileType}}) => {
  return (
    <div style={{display: "flex"}}>
      <FileTypeIcon {...{fileType}} />
      <span title={fileType}>{getFriendlyTypename(fileType)}</span>
    </div>
  );
};

FileTypeColumn.flexGrow = 0;
FileTypeColumn.columnWidth = 100;

FileTypeColumn.propTypes = {
  rowData: PropTypes.shape({
    fileType: PropTypes.string,
  }),
};

const DownloadLinkColumn =
  ({policy, signature}) =>
  ({rowData: {url} = {}}) => {
    const href = `${url}?policy=${policy}&signature=${signature}`;
    return (
      <IconButton
        href={href}
        target="_blank"
        style={{
          color: "#546e7a",
          padding: "4px 12px",
          borderRadius: "3px",
        }}
      >
        <DownloadIcon />
      </IconButton>
    );
  };
DownloadLinkColumn.flexGrow = 0;
DownloadLinkColumn.columnWidth = 45;

DownloadLinkColumn.propTypes = {
  rowData: PropTypes.shape({
    url: PropTypes.string,
  }),
};

export default FileUploadsTable;
