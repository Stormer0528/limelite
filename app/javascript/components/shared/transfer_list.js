import PropTypes from "prop-types";
import React, {useState} from "react";
import {makeStyles} from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Checkbox from "@material-ui/core/Checkbox";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

export default function TransferList({
  currentUsers = [],
  allUsers = [],
  handleChange = function () {},
}) {
  const classes = useStyles();
  const [checked, setChecked] = useState([]);
  const [left, setLeft] = useState(allUsers);
  const [right, setRight] = useState(currentUsers);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items) => intersection(checked, items).length;

  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    const selectedUsers = right.concat(leftChecked);
    setRight(selectedUsers);
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
    handleChange(selectedUsers);
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    const selectedUsers = not(right, rightChecked);
    setRight(selectedUsers);
    setChecked(not(checked, rightChecked));
    handleChange(selectedUsers);
  };

  const customList = (title, items) => (
    <Card className={classes.card}>
      <CardHeader
        className={classes.cardHeader}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={
              numberOfChecked(items) === items.length && items.length !== 0
            }
            indeterminate={
              numberOfChecked(items) !== items.length &&
              numberOfChecked(items) !== 0
            }
            disabled={items.length === 0}
            inputProps={{"aria-label": "all items selected"}}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
      />
      <Divider />
      <List className={classes.list} dense component="div" role="list">
        {items.map((user) => {
          const labelId = `transfer-list-all-item-${user}-label`;

          return (
            <ListItem
              key={user.id}
              role="listitem"
              button
              onClick={handleToggle(user)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(user) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{"aria-labelledby": labelId}}
                />
              </ListItemIcon>
              <ListItemText
                id={labelId}
                primary={user.fullName}
                secondary={user.email}
              />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Card>
  );

  return (
    <Grid
      container
      spacing={2}
      justifyContent="center"
      alignItems="center"
      className={classes.root}
    >
      <Grid item xs className={classes.column}>
        {customList("All Users", left)}
      </Grid>
      <Grid item>
        <Grid container direction="column" alignItems="center">
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label="move selected right"
          >
            &gt;
          </Button>
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label="move selected left"
          >
            &lt;
          </Button>
        </Grid>
      </Grid>
      <Grid item xs className={classes.column}>
        {customList("Group Users", right)}
      </Grid>
    </Grid>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    display: "grid",
    gridTemplateColumns: "1fr 85px 1fr",
  },
  column: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardHeader: {
    padding: theme.spacing(1, 2),
    background: "#cfd8db",
  },
  list: {
    maxHeight: "75vh",
    backgroundColor: theme.palette.background.paper,
    overflow: "auto",
  },
  button: {
    margin: theme.spacing(0.5, 0),
  },
  card: {
    height: "100%",
  },
}));

TransferList.propTypes = {
  currentUsers: PropTypes.array,
  allUsers: PropTypes.array,
  handleChange: PropTypes.func,
};

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
  return [...a, ...not(b, a)];
}
