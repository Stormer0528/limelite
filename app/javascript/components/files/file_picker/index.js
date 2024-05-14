import ConfirmationSidebar from "./confirmation_sidebar";
import FilestackPicker from "./filstackpicker";
import CREATE_FILE_UPLOAD_MUTATION from "@graphql/mutations/create_file_upload";
import FILESTACK_PERMISSIONS_QUERY from "@graphql/queries/file_stack_permissions.gql";
import {titleCase} from "humanize-plus";
import {basename} from "path";
import {useState} from "react";
import {useQuery, useMutation} from "react-apollo";

const titleize = (str = "") => titleCase(basename(str).replace(/[-_]/g, " "));

const FilePicker = ({userId}) => {
  const [open, setIsOpen] = useState(false);
  const [saveFileUpload] = useMutation(CREATE_FILE_UPLOAD_MUTATION);
  const [sidebarFiles, setSidebarFiles] = useState({});

  const {data: {filestack: {apikey, security} = {}} = {}} = useQuery(
    FILESTACK_PERMISSIONS_QUERY,
    {
      pollInterval: 1000 * 60 * 5, // Refresh every 5 mins
      partialRefetch: true,
    }
  );

  if (!apikey) return null;

  async function onFileUploaded(uploadResult) {
    const {filesUploaded: filesToUpload = [], filesFailed = []} = uploadResult;

    const uploaded = filesToUpload.map(async (file) => {
      const {url, filename, mimetype: fileType} = file;
      const fileUpload = {
        uploadableId: userId || "",
        uploadableType: "User",
        url,
        description: titleize(filename),
        fileType,
      };

      const {
        data: {fileUpload: uploadedFile},
      } = await saveFileUpload({
        variables: {fileUpload},
      });

      return {...file, ...uploadedFile};
    });

    // Open modified Sidebar once all files have uploaded
    Promise.all(uploaded).then((filesUploaded) => {
      setSidebarFiles({filesFailed, filesUploaded});
      setIsOpen(true);
    });
  }

  const handleClose = () => {
    setIsOpen(false);
    window.location.href = "/files";
  };

  return (
    <>
      <FilestackPicker
        apikey={apikey}
        clientOptions={{
          security,
        }}
        pickerOptions={{
          fromSources: [
            "local_file_system",
            "url",
            "imagesearch",
            "googledrive",
          ],
        }}
        onError={(error, other) => console.error(error, other)}
        onSuccess={onFileUploaded}
      />
      <ConfirmationSidebar {...{open, ...sidebarFiles}} onClose={handleClose} />
    </>
  );
};

export default FilePicker;
