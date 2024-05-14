import SvgIcon from "@material-ui/core/SvgIcon";
import {mdiFileUpload} from "@mdi/js";

export default function (props) {
  return (
    <SvgIcon {...props}>
      <path d={mdiFileUpload} />
    </SvgIcon>
  );
}
