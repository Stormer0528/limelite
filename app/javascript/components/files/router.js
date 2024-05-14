import FilePicker from "./file_picker";
import FileUploadsTable from "./file_uploads_table";
import Paper from "@material-ui/core/Paper";
import {useState, useEffect} from "react";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";

const FilesRouter = () => {
  const [userId, setUserId] = useState();
  const [organizationId, setOrganizationId] = useState();

  useEffect(() => {
    const container = document.body.querySelector("#files_index");
    setOrganizationId(container.dataset.organizationId);
    setUserId(container.dataset.userId);
  }, []);

  return (
    <Router basename="/files">
      <Switch>
        <Route exact path="/">
          <Paper>
            <FileUploadsTable organizationId={organizationId} />
          </Paper>
        </Route>

        <Route exact path="/new">
          <Paper>
            <FilePicker userId={userId} />
          </Paper>
        </Route>
      </Switch>
    </Router>
  );
};

export default FilesRouter;
