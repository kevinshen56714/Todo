import React from "react";
import styled from "styled-components";
import db from "../Firebase";
import { ref, remove, update } from "firebase/database";
import ITodo from "../Types/ITodo";

import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";

const CustomizedListItem = styled(ListItem)`
  .hover-show {
    opacity: 0;
  }
  :hover {
    .hover-show {
      opacity: 1;
    }
  }
`;

class Todo extends React.Component<ITodo> {
  state = { editting: this.props.content === "", editText: this.props.content };

  handleCompleteToggle = () => {
    const updatedComplete = !this.props.complete;
    const updates: any = {};
    updates[`post/${this.props.id}/complete`] = updatedComplete;
    update(ref(db), updates);
  };

  delete = () => {
    remove(ref(db, "post/" + this.props.id));
  };

  updateContent = (updatedContent: string) => {
    const updates: any = {};
    updates[`post/${this.props.id}/content`] = updatedContent;
    update(ref(db), updates);
  };

  handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      this.setState({ editting: false });
      this.setState({ editText: this.props.content });
      // this.props.onCancel(event);
    } else if (event.key === "Enter") {
      this.handleSubmit(event);
    }
  };

  handleSubmit = (event: React.KeyboardEvent) => {
    var val = this.state.editText.trim();
    if (val) {
      const updates: any = {};
      updates[`post/${this.props.id}/content`] = val;
      update(ref(db), updates);
      this.setState({ editting: false });
    }
  };

  handleChange = (event: React.FormEvent) => {
    var input: any = event.target;
    this.setState({ editText: input.value });
  };

  render() {
    const { editting, editText } = this.state;
    return (
      <CustomizedListItem
        key={this.props.id}
        secondaryAction={
          <>
            {editting ? (
              <>
                {/* <Tooltip title="edit" arrow>
                  <span>
                    <IconButton
                      aria-label="complete"
                      size="small"
                      onClick={() => this.setState({ editting: false })}
                      disabled={false}
                    >
                      <CheckIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip> */}
                <Tooltip title="cancel" arrow>
                  <span>
                    <IconButton
                      aria-label="cancel"
                      size="small"
                      onClick={() => this.setState({ editting: false })}
                      disabled={false}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              </>
            ) : (
              <>
                <Tooltip title="edit" arrow>
                  <span>
                    <IconButton
                      className="hover-show"
                      aria-label="edit"
                      size="small"
                      onClick={() => this.setState({ editting: true })}
                      disabled={false}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title="delete" arrow>
                  <span>
                    <IconButton
                      className="hover-show"
                      aria-label="delete"
                      size="small"
                      onClick={this.delete}
                      disabled={false}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              </>
            )}
          </>
        }
        disablePadding
      >
        {editting ? (
          <ListItemButton role={undefined} divider dense>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={this.props.complete}
                tabIndex={-1}
                disableRipple
                onClick={this.handleCompleteToggle}
                inputProps={{ "aria-labelledby": this.props.id }}
              />
            </ListItemIcon>
            <TextField
              id={this.props.id}
              value={editText}
              variant="standard"
              autoFocus={true}
              onChange={(e) => this.handleChange(e)}
              onKeyDown={(e) => {
                this.handleKeyDown(e);
              }}
            />
          </ListItemButton>
        ) : (
          <ListItemButton
            role={undefined}
            divider
            dense
            onClick={this.handleCompleteToggle}
          >
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={this.props.complete}
                tabIndex={-1}
                disableRipple
                inputProps={{ "aria-labelledby": this.props.id }}
              />
            </ListItemIcon>
            <ListItemText id={this.props.id} primary={this.props.content} />
          </ListItemButton>
        )}
      </CustomizedListItem>
    );
  }
}

export default Todo;
