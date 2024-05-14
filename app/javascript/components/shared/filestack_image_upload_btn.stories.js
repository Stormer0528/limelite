import ThemeDecorator, {CSSBaseline} from "./stories/theme_decorator";

import ApolloDecorator from "./stories/apollo_decorator";
import {MockedProvider} from "@apollo/react-testing";
import TestUserImage from "../../../assets/images/office.jpg";

import AvatarUploader from "./filestack_image_upload_btn";
import FILESTACK_PERMISSIONS_QUERY from "../../graphql/queries/file_stack_permissions.gql";

export default {
  title: "Shared/UserImageUpload",
  component: AvatarUploader,
  decorators: [ApolloDecorator, ThemeDecorator, CSSBaseline, mockedDecorator],
};

export const Empty = () => <AvatarUploader />;
export const WithImage = () => <AvatarUploader value={TestUserImage} />;

const mockedDecorator = (storyFunc) => {
  return (
    <MockedProvider mocks={mocks} addTypename={false}>
      {storyFunc()}
    </MockedProvider>
  );
};

const mocks = [
  {
    request: {
      query: FILESTACK_PERMISSIONS_QUERY,
    },
    result: {
      data: {
        filestack: {
          apikey: "A3SHiekqQca2gbP6t2DfBz",
          clientName: "filestack_client",
          security: {
            signature:
              "68d2635928a39a7549c842b7139a9cb89c7290ce1dd5d4f90019ee69c52add83",
            policy:
              "eyJjYWxsIjpbInBpY2siLCJyZWFkIiwiY29udmVydCIsInVwbG9hZCIsInN0YXQiLCJzdG9yZSIsImV4aWYiXSwiZXhwaXJ5IjoxNTkyNjk0MjE0fQ==",
          },
        },
      },
    },
  },
];
