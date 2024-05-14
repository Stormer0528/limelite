import {ApolloProvider} from "react-apollo";

import {setupApolloClient} from "../../../utils";

const client = setupApolloClient();

export default function (storyFn) {
  return <ApolloProvider client={client}>{storyFn()}</ApolloProvider>;
}
