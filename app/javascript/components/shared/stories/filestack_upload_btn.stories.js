// import centered from "@storybook/addon-centered/react";
import {withKnobs, number /*text, boolean*/} from "@storybook/addon-knobs";

import FilestackUploadBtn from "../filestack_upload_btn";
import FilestackImageUploadBtn from "../filestack_image_upload_btn";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

export default {
  component: FilestackUploadBtn,
  title: "Shared/Upload Buttons",
  decorators: [withKnobs],
  // parameters: [],
};

export const filestackUploadBtn = () => (
  <Card>
    <CardContent>
      <div style={{width: number("width", 350)}}>
        <FilestackUploadBtn />
      </div>
    </CardContent>
  </Card>
);

export const filestackImageUploadBtn = () => (
  <Card>
    <CardContent>
      <div style={{width: number("width", 350)}}>
        <FilestackImageUploadBtn />
      </div>
    </CardContent>
  </Card>
);
