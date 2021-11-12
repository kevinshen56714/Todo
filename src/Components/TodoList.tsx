import { useState, useEffect } from "react";
import db from "../Firebase";
import { ref, push, get, onValue } from "firebase/database";
import { saveAs } from "file-saver";
import ITodo from "../Types/ITodo";
import Todo from "./Todo";
import List from "@mui/material/List";
import AddIcon from "@material-ui/icons/AddCircle";
import DownloadIcon from "@mui/icons-material/Download";
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

function downloadTodos() {
  var todoSummary = "";
  var counter = 0;
  get(ref(db, "post/"))
    .then((snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const val = childSnapshot.val();
          todoSummary += `Item ${++counter}\n`;
          todoSummary += `completed: ${val.complete}\n`;
          todoSummary += `content: ${val.content}\n\n`;
        });
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      const blob = new Blob([todoSummary], {
        type: "text/plain;charset=utf-8",
      });
      saveAs(blob, "todolist.txt");
    });
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
        const val = childSnapshot.val();
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
      <Tooltip title="download" arrow>
        <span>
          <IconButton
            aria-label="download"
            size="small"
            onClick={downloadTodos}
            disabled={false}
          >
            <DownloadIcon fontSize="small" />
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
