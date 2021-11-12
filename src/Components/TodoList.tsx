import { useState, useEffect } from "react";
import db from "../Firebase";
import { ref, push, onValue } from "firebase/database";
import ITodo from "../Types/ITodo";
import Todo from "./Todo";
import List from "@mui/material/List";
import AddIcon from "@material-ui/icons/AddCircle";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";

function createTodo() {
  push(ref(db, "post/"), {
    complete: false,
    content: "",
  })
    .then(() => console.log("successfully created a new todo"))
    .catch((e) => console.log(e.message));
}

export default function TodoList() {
  // setup hooks for todolist
  const [todoList, setTodoList] = useState<ITodo[]>(new Array<ITodo>());

  // listen to Firebase post onValue event
  useEffect(() => {
    const todoRef = ref(db, "post");
    onValue(todoRef, (snapshot) => {
      const updatedTodoList = new Array<ITodo>();
      snapshot.forEach((childSnapshot) => {
        const key = childSnapshot.key;
        const val = childSnapshot.val() as ITodo;
        if (key) {
          updatedTodoList.push({
            id: key,
            complete: val.complete,
            content: val.content,
          });
        }
      });
      setTodoList(updatedTodoList);
    });
  }, []);

  return (
    <div>
      <h1>TodoList</h1>
      <Tooltip title="add" arrow>
        <span>
          <IconButton
            aria-label="add"
            size="small"
            onClick={createTodo}
            disabled={false}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      <List sx={{ width: "50%", maxWidth: 360, bgcolor: "background.paper" }}>
        {todoList.map((todo) => {
          return (
            <Todo
              id={todo.id}
              content={todo.content}
              complete={todo.complete}
            />
          );
        })}
      </List>
    </div>
  );
}
