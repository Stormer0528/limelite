import {useQuery} from "@apollo/react-hooks";
import FILESTACK_PERMISSIONS_QUERY from "@graphql/queries/file_stack_permissions.gql";
import InvoiceQuery from "@graphql/queries/invoice.gql";
import Grid from "@material-ui/core/Grid";
import {withStyles} from "@material-ui/core/styles";
import Description from "@material-ui/icons/Description";

const Invoice = ({classes = {}, id}) => {
  const {loading: loadingFilestack, data: {filestack: {security} = {}} = {}} =
    useQuery(FILESTACK_PERMISSIONS_QUERY, {
      fetchPolicy: "network-only",
      pollInterval: 1000 * 60 * 4, // Refresh every 4 mins
    });

  const {loading: loadingInvoice, data: {invoice = {}} = {}} = useQuery(
    InvoiceQuery,
    {
      variables: {id},
    }
  );

  if (loadingInvoice || loadingFilestack) return null;

  return (
    <section className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={6} className={classes.headerItem}>
          <b>Invoice #:</b>
          {invoice.number}
        </Grid>

        <Grid item xs={6} className={classes.headerItem}>
          <b>Amount:</b>
          {invoice.amount}
        </Grid>

        <Grid item xs={6}>
          <b>Invoice Date:</b>
          {invoice.date}
        </Grid>

        <Grid item xs={6}>
          <b>Due Date:</b>
          {invoice.dueDate}
        </Grid>

        <Grid item xs={6}>
          <b>File Upload:</b>
          <a
            href={`${invoice.fileUrl}?policy=${security.policy}&signature=${security.signature}`}
            target="_blank"
          >
            <Description />
          </a>
        </Grid>

        <Grid item xs={6}>
          <b>Approved With:</b>
          {invoice.notes}
        </Grid>

        <Grid item xs={6}>
          <b>Bank Account:</b>
          {invoice.accountObject}
        </Grid>

        <Grid item xs={6}>
          <div>
            <b>Address Type:</b>
            {invoice.addressType}
          </div>

          <div>
            <b>Address:</b>
            {invoice.addressText}
          </div>
        </Grid>

        <Grid item xs={12}>
          <div>
            <b>Description</b>
          </div>
          <div>{invoice.description}</div>
        </Grid>
      </Grid>
    </section>
  );
};

const styles = (theme) => ({
  root: {
    padding: ".5em 1em",
    "& b": {
      paddingRight: 5,
    },
  },
  headerItem: {
    fontSize: 24,
  },
});

export default withStyles(styles)(Invoice);
