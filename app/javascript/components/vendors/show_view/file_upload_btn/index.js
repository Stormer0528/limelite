import {basename} from "path";
import {Fragment, useState} from "react";
import PropTypes from "prop-types";

import {useMutation} from "react-apollo";
import SaveBtn from "./btn";
import {titleCase} from "humanize-plus";

import CREATE_FILE_UPLOAD_MUTATION from "@graphql/mutations/create_file_upload";
import ConfirmationSidebar from "./confirmation_sidebar";

const VendorSaveBtn = ({vendorId = 4253, ...props}) => {
  const [open, setIsOpen] = useState(false);
  const [sidebarFiles, setSidebarFiles] = useState({});

  const [saveFileUpload] = useMutation(CREATE_FILE_UPLOAD_MUTATION);

  const handleClose = () => {
    setIsOpen(false);
  };

  async function onFileUploaded(uploadResult) {
    const {filesUploaded: filesToUpload = [], filesFailed = []} = uploadResult;

    const uploaded = filesToUpload.map(async (file) => {
      const {url, filename, mimetype: fileType} = file;
      const fileUpload = {
        uploadableId: vendorId,
        uploadableType: "Vendor",
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

  return (
    <Fragment>
      <SaveBtn
        {...props}
        multiple={true}
        {...{onFileUploaded, options: {maxFiles: 100}}}
      />
      <ConfirmationSidebar {...{open, ...sidebarFiles}} onClose={handleClose} />
    </Fragment>
  );
};

VendorSaveBtn.propTypes = {
  vendorId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default VendorSaveBtn;

const titleize = (str = "") => titleCase(basename(str).replace(/[-_]/g, " "));
