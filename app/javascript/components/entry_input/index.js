import EntryInput from "./entry_input";
import DateWrapper from "../../components/shared/date_wrapper";
import ThemeWrapper from "../../components/shared/theme_wrapper";
import {compose} from "redux";

export default compose(ThemeWrapper, DateWrapper)(EntryInput);
