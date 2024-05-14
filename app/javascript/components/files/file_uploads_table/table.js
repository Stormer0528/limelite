import CONFIRM_FILE_DOWNLOADED from "../../../graphql/mutations/mark_file_downloaded.gql";
import FILE_UPLOADS_QUERY from "../../../graphql/queries/file_uploads.gql";
import FileDownloadConfirmationDialog from "./file_download_confirmation";
import FileTypeIcon, {getFriendlyTypename} from "./file_type_icon";
import Filter from "./filter";
import FILESTACK_PERMISSIONS_QUERY from "@graphql/queries/file_stack_permissions.gql";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import DownloadIcon from "@material-ui/icons/GetApp";
import {useFormikContext} from "formik";
import PropTypes from "prop-types";
import {Fragment, useMemo, useState} from "react";
import {useQuery, useMutation} from "react-apollo";
import DateRenderer from "searchable_table/components/defaults/date_column";
import TextRenderer from "searchable_table/components/defaults/text_column";
// Components
import SearchableTable from "searchable_table/searchable_table";

const FileUploadsTable = ({organizationId}) => {
  const [fileConfirmation, setFileConfirmation] = useState({
    open: false,
    fileId: null,
  });
  const {values: formValues = {}} = useFormikContext();
  const {loading: filestackLoading, data: {filestack: {security} = {}} = {}} =
    useQuery(FILESTACK_PERMISSIONS_QUERY, {
      fetchPolicy: "network-only",
      pollInterval: 1000 * 60 * 4, // Refresh every 4 mins
    });

  const {
    refetch,
    data: {fileUploadSearchConnection: {fileUploads = []} = {}} = {},
  } = useQuery(FILE_UPLOADS_QUERY, {
    fetchPolicy: "cache-and-network",
    variables: {
      uploadableType: "User",
      uploadableId: "",
      filetype: formValues.filetype,
      description: formValues.description,
      unarchived: !formValues.archived,
    },
  });

  const formattedFileUploads = fileUploads.map((upload) => {
    const {updatedAt: date, creator, organization} = upload;
    const [datePart, timePart] = date.split(" ");

    return {
      ...upload,
      userName: creator.firstName + " " + creator.lastName,
      orgName: organization.name,
      updatedAt: datePart + " " + timePart,
    };
  });

  const [confirmFileDownloaded] = useMutation(CONFIRM_FILE_DOWNLOADED);
  const onFileDownloaded = (fileId) => {
    setFileConfirmation({open: true, fileId});
  };

  const onMarkFileDownloaded = async () => {
    console.log(fileConfirmation.fileId);

    await confirmFileDownloaded({
      variables: {fileUploadId: fileConfirmation.fileId},
    });
    refetch();

    setFileConfirmation({open: false});
  };

  const {headers, cells} = useMemo(() => {
    if (filestackLoading) return {};

    const cells = [
      FileTypeColumn,
      TextRenderer("description", {
        columnWidth: 200,
        flexGrow: 3,
      }),
      TextRenderer("userName", {
        columnWidth: 115,
        flexGrow: 0,
      }),
      DateRenderer("updatedAt", {
        flexGrow: 0,
        columnWidth: 115,
        inputDateFormat: "yyyy-MM-dd HH:mm:ss",
        dateFormat: "MM/dd/yyyy HH:mm:ss",
      }),
      DownloadLinkColumn(security, onFileDownloaded),
      CheckBoxColumn,
    ];
    const headers = ["Type", "Description", "User", "Date Added", "", ""];
    if (!organizationId) {
      cells.splice(
        3,
        0,
        TextRenderer("orgName", {columnWidth: 175, flexGrow: 0})
      );
      headers.splice(3, 0, "Organization");
    }

    return {cells, headers};
  }, [organizationId, filestackLoading, security]);

  if (filestackLoading) return null;

  return (
    <Fragment>
      <Filter shouldShowUploadButton={Boolean(organizationId)} />
      <SearchableTable
        data={formattedFileUploads}
        headers={headers}
        cells={cells}
      />

      <FileDownloadConfirmationDialog
        open={fileConfirmation.open}
        onClose={() => setFileConfirmation({open: false})}
        onConfirm={onMarkFileDownloaded}
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

const DownloadLinkColumn = ({policy, signature}, onFileDownload) => {
  const renderFunc = ({rowData: {url, id, apDownloaded} = {}}) => {
    const href = `${url}?policy=${policy}&signature=${signature}`;

    return (
      <IconButton
        href={href}
        target="_blank"
        style={{
          color: "#546e7a",
          padding: "4px 12px",
          borderRadius: "3px",
          flexGrow: 0,
        }}
        onClick={() => {
          if (!apDownloaded) {
            onFileDownload(id);
          }
        }}
      >
        <DownloadIcon />
      </IconButton>
    );
  };

  renderFunc.flexGrow = 0;
  renderFunc.columnWidth = 45;

  renderFunc.propTypes = {
    rowData: PropTypes.shape({
      url: PropTypes.string,
      id: PropTypes.string,
      apDownloaded: PropTypes.bool,
    }),
  };

  return renderFunc;
};

const CheckBoxColumn = ({rowData: {apDownloaded} = {}}) => {
  return <Checkbox checked={apDownloaded} />;
};
CheckBoxColumn.flexGrow = 0;
CheckBoxColumn.columnWidth = 45;
CheckBoxColumn.propTypes = {
  rowData: PropTypes.shape({
    apDownloaded: PropTypes.bool,
  }),
};

export default FileUploadsTable;
