import Breadcrumb from "./breadcrumb";
import TopBar from "../shared/updated_top_bar";

export default function Loading({classes = {}}) {
  return (
    <section className={`BalanceSheetReport react-inputs ${classes.container}`}>
      <Breadcrumb />
      <TopBar
        {...{
          handleRunClick: () => {},
          loading: true,
          dirty: false,
        }}
      />
      <h4>Loading...</h4>
    </section>
  );
}
