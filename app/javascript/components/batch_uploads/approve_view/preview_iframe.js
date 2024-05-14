import {useState, useEffect} from "react";
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";

import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";

import LaunchIcon from "@material-ui/icons/Launch";
import RefreshIcon from "@material-ui/icons/Cached";

function PreviewIframe({
  width = "100%",
  height = "35vh",
  file = {},
  signature,
  policy,
  refetch = function () {},
}) {
  const [fileUrl, setFileUrl] = useState(
    `https://cdn.filestackcontent.com/${file.handle}?dl=false&policy=${policy}&signature=${signature}`
  );

  useEffect(() => {
    setFileUrl(
      `https://cdn.filestackcontent.com/${file.handle}?dl=false&policy=${policy}&signature=${signature}`
    );
  }, [file.handle, setFileUrl, policy, signature]);

  const handleRefetch = (e) => {
    e.preventDefault();
    refetch();
  };

  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <iframe
        style={{
          width,
          height,
          border: "1px solid",
          borderRadius: 3,
        }}
        src={fileUrl}
      />

      <IconButton
        className={classes.Button}
        target="_blank"
        rel="noopener noreferrer"
        href={fileUrl}
        title="Preview in a New Window"
        variant="contained"
        size="small"
      >
        <LaunchIcon />
      </IconButton>
      <IconButton
        className={classes.Button2}
        target="_blank"
        rel="noopener noreferrer"
        href="#"
        onClick={handleRefetch}
        title="Reload File"
        variant="contained"
        size="small"
      >
        <RefreshIcon />
      </IconButton>
    </Box>
  );
}

PreviewIframe.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  file: PropTypes.object,
  signature: PropTypes.string,
  policy: PropTypes.string,
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "-8px",
    marginLeft: "-8px",
    marginBottom: "-40px",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  Button: {
    background: "white",
    alignSelf: "flex-end",
    position: "relative",
    top: -54,
    zIndex: 999,
    opacity: 0.65,

    "&:hover": {
      opacity: 1,
      background: "white",
    },
  },
  Button2: {
    top: "-99px",
    opacity: 0.65,
    zIndex: 999,
    position: "relative",
    alignSelf: "flex-end",
    background: "#fff",
    right: 32,

    "&:hover": {
      opacity: 1,
      background: "white",
    },
  },
}));

export default PreviewIframe;
