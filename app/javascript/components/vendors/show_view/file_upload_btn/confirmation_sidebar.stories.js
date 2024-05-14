import ThemeDecorator, {
  CSSBaseline,
} from "../../../shared/stories/theme_decorator";

import ApolloDecorator from "../../../shared/stories/apollo_decorator";

import ConfirmationSidebar from "./confirmation_sidebar";

const defaultProps = {
  in: true,
  direction: "left",
  timeout: {
    enter: 225,
    exit: 195,
  },
  appear: true,
  filesUploaded: [
    {
      filename: "Budget 2013.xlsx",
      handle: "F0hujYVQ7ebFgkbFajqA",
      mimetype:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      originalPath: "Budget 2013.xlsx",
      size: 36493,
      source: "local_file_system",
      url: "https://cdn.filestackcontent.com/F0hujYVQ7ebFgkbFajqA",
      uploadId: "68E31D4ZEP6E4HUJ",
      originalFile: {
        name: "Budget 2013.xlsx",
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        size: 36493,
      },
      status: "Stored",
      key: "dbohrjYGRtWcWgN64lFl_Budget 2013.xlsx",
      container: "limeliteds",
      id: "26",
      fileType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      description: "Budget 2013.xlsx",
      __typename: "FileUpload",
    },
    {
      filename: "checkbox.png",
      handle: "u80MeoFMTr2YTvzVAPPL",
      mimetype: "image/png",
      originalPath: "checkbox.png",
      size: 1853,
      source: "local_file_system",
      url: "https://cdn.filestackcontent.com/u80MeoFMTr2YTvzVAPPL",
      uploadId: "Row73Iy8SEjwBMRT",
      originalFile: {
        name: "checkbox.png",
        type: "image/png",
        size: 1853,
      },
      status: "Stored",
      key: "re4G1rkWQjUpG2aguRIz_checkbox.png",
      container: "limeliteds",
      id: "25",
      fileType: "image/png",
      description: "Checkbox.png",
      __typename: "FileUpload",
    },
    {
      filename: "College Tech Core Goals.docx",
      handle: "rilXUqHBStGtHfy2Paht",
      mimetype:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      originalPath: "College Tech Core Goals.docx",
      size: 34586,
      source: "local_file_system",
      url: "https://cdn.filestackcontent.com/rilXUqHBStGtHfy2Paht",
      uploadId: "JtUgCR3dCM69H8Km",
      originalFile: {
        name: "College Tech Core Goals.docx",
        type:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        size: 34586,
      },
      status: "Stored",
      key: "HUOMyRbJRIOq65SY7aVF_College Tech Core Goals.docx",
      container: "limeliteds",
      id: "27",
      fileType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      description: "College Tech Core Goals.docx",
      __typename: "FileUpload",
    },
  ],
  filesFailed: [
    {
      filename: "Budget 2013.xlsx",
      handle: "F0hujYVQ7ebFgkbFajqA",
      mimetype:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      originalPath: "Budget 2013.xlsx",
      size: 36493,
      source: "local_file_system",
      url: "https://cdn.filestackcontent.com/F0hujYVQ7ebFgkbFajqA",
      uploadId: "68E31D4ZEP6E4HUJ",
      originalFile: {
        name: "Budget 2013.xlsx",
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        size: 36493,
      },
      status: "Stored",
      key: "dbohrjYGRtWcWgN64lFl_Budget 2013.xlsx",
      container: "limeliteds",
      id: "26",
      fileType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      description: "Budget 2013.xlsx",
      __typename: "FileUpload",
    },
    {
      filename: "checkbox.png",
      handle: "u80MeoFMTr2YTvzVAPPL",
      mimetype: "image/png",
      originalPath: "checkbox.png",
      size: 1853,
      source: "local_file_system",
      url: "https://cdn.filestackcontent.com/u80MeoFMTr2YTvzVAPPL",
      uploadId: "Row73Iy8SEjwBMRT",
      originalFile: {
        name: "checkbox.png",
        type: "image/png",
        size: 1853,
      },
      status: "Stored",
      key: "re4G1rkWQjUpG2aguRIz_checkbox.png",
      container: "limeliteds",
      id: "25",
      fileType: "image/png",
      description: "Checkbox.png",
      __typename: "FileUpload",
    },
    {
      filename: "College Tech Core Goals.docx",
      handle: "rilXUqHBStGtHfy2Paht",
      mimetype:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      originalPath: "College Tech Core Goals.docx",
      size: 34586,
      source: "local_file_system",
      url: "https://cdn.filestackcontent.com/rilXUqHBStGtHfy2Paht",
      uploadId: "JtUgCR3dCM69H8Km",
      originalFile: {
        name: "College Tech Core Goals.docx",
        type:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        size: 34586,
      },
      status: "Stored",
      key: "HUOMyRbJRIOq65SY7aVF_College Tech Core Goals.docx",
      container: "limeliteds",
      id: "27",
      fileType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      description: "College Tech Core Goals.docx",
      __typename: "FileUpload",
    },
  ],
};

export default {
  title: "File Upload Confirmation Sidebar",
  component: ConfirmationSidebar,
  decorators: [ApolloDecorator, ThemeDecorator, CSSBaseline],
};

export const Open = () => <ConfirmationSidebar open {...defaultProps} />;
Open.story = {
  name: "ConfirmationSidebar",
};
