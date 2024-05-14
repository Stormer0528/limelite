import ThemeDecorator, {CSSBaseline} from "../shared/stories/theme_decorator";

import ApolloDecorator from "../shared/stories/apollo_decorator";
import {MockedProvider} from "@apollo/react-testing";
import ShowView from "./show_view";
// import EditView from "./edit_view";
import UserForm from "./form";
import FILESTACK_PERMISSIONS_QUERY from "../../graphql/queries/file_stack_permissions.gql";

export default {
  title: "Users",
  component: EmptyComponent,
  decorators: [ApolloDecorator, ThemeDecorator, CSSBaseline],
};

export const Edit = () => (
  <MockedProvider mocks={mocks} addTypename={false}>
    <div style={{margin: "15vh 5vw 2em"}}>
      <ShowView />
    </div>
  </MockedProvider>
);
Edit.story = {
  name: "User#show",
};

// export const Edit = () => <EditView />;
// Edit.story = {
//   name: "User#edit",
// };

export const Form = () => <UserForm />;
Form.story = {
  name: "Form",
};

const EmptyComponent = () => null;

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
