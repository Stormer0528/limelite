import React from "react";
import Topbbar from "./index";
import {render, fireEvent, waitFor, screen} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import {ExpansionPanelActions} from "@material-ui/core";

it("Renders correctly", () => {
  const {asFragment} = render(<Topbbar />);
  expect(asFragment()).toMatchSnapshot();
});
