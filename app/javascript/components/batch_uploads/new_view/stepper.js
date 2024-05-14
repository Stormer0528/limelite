import PropTypes from "prop-types";
import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import Typography from "@material-ui/core/Typography";

import UploadIcon from "@material-ui/icons/CloudUpload";
import {makeStyles} from "@material-ui/core/styles";

// Steps
import StepOne from "./step_one";
import StepTwo from "./step_two";

export default function BatchUploadStepper({
  signature,
  policy,
  currentStep,
  batchFiles = {
    filesUploaded: [],
    filesFailed: [],
  },

  setCurrentStep = function () {},
  setBatchFiles = function () {},
  filestackRefetch = function () {},
}) {
  const classes = useStyles();
  return (
    <Card variant="outlined" className={classes.root}>
      <CardContent>
        <Typography
          gutterBottom
          variant="h5"
          component="h2"
          className={classes.header}
        >
          <Avatar className={classes.avatar} color="primary">
            <UploadIcon />
          </Avatar>
          Batch Upload Vendor Invoices
        </Typography>
        <Stepper activeStep={currentStep} orientation="vertical">
          <Step key={0}>
            <StepLabel>Find &amp; Upload Invoices</StepLabel>
            <StepContent>
              <StepOne
                setCurrentStep={setCurrentStep}
                setBatchFiles={setBatchFiles}
              />
            </StepContent>
          </Step>
          <Step key={1}>
            <StepLabel>Update Invoice Information</StepLabel>
            <StepContent>
              <StepTwo
                batchFiles={batchFiles}
                signature={signature}
                policy={policy}
                refetch={filestackRefetch}
              />
            </StepContent>
          </Step>
        </Stepper>
      </CardContent>
    </Card>
  );
}

BatchUploadStepper.propTypes = {
  signature: PropTypes.string,
  policy: PropTypes.string,
  currentStep: PropTypes.number,
  setCurrentStep: PropTypes.func,
  batchFiles: PropTypes.shape({
    filesUploaded: PropTypes.array,
    filesFailed: PropTypes.array,
  }),
  setBatchFiles: PropTypes.func,
  filestackRefetch: PropTypes.func,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginBottom: 120,
  },
  header: {
    display: "flex",
    alignItems: "center",
  },
  avatar: {
    marginRight: theme.spacing(1),
    backgroundColor: theme.palette.primary.light,
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  resetContainer: {
    padding: theme.spacing(3),
  },
}));
