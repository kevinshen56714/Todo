import { useState, useEffect } from "react";
import styled from "styled-components";
import db from "../Firebase";
import { ref, push, get, onValue } from "firebase/database";
import { saveAs } from "file-saver";
import ITodo from "../Types/ITodo";
import Todo from "./Todo";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import DownloadIcon from "@mui/icons-material/Download";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";

const Wrapper = styled.div`
  width: 600px;
  max-width: 80%;
  background: #ffffff88;
  box-shadow: 0 10px 80px #0000003d;
  display: flex;
  flex-direction: column;
  margin: 10%;
  border-radius: 16px;
  padding-top: 20px;

  h1 {
    margin: 0px;
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
`;

const CounterText = styled.p`
  color: #000;
  opacity: 0.5;
  font-size: 14px;
  margin: 0;
`;

const TopWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
`;

const TodoWrapper = styled.div`
  max-height: 85%;
  overflow-y: auto;
`;

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

function NewTodoRow() {
  const [editText, setEditText] = useState<string>("");

  function handleSubmit() {
    if (editText) {
      push(ref(db, "post/"), {
        complete: false,
        content: editText,
        createdAt: new Date().getTime(),
      })
        .then(() => setEditText(""))
        .catch((e) => console.log(e.message));
    }
  }
  return (
    <>
      <ListItem>
        <TextField
          id="newTodo"
          label="Add a new Task..."
          fullWidth
          value={editText}
          variant="standard"
          autoFocus={true}
          color="secondary"
          onChange={(e) => {
            var input: any = e.target;
            setEditText(input.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}
        />
      </ListItem>
    </>
  );
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
            createdAt: val.createdAt,
          });
        }
      });
      setTodoList(updatedTodoList);
    });
  }, []);

  return (
    <Wrapper>
      <TopWrapper>
        <TitleWrapper>
          <h1>TodoList</h1>
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
        </TitleWrapper>
        <CounterText>
          {
            todoList.filter((todo) => {
              return !todo.complete;
            }).length
          }{" "}
          More to go!
        </CounterText>
      </TopWrapper>
      <List
        sx={{
          width: "100%",
          height: "100%",
          bgcolor: "background: #ffffff83;",
          padding: 0,
          overflow: "hidden",
        }}
      >
        <NewTodoRow />
        <TodoWrapper>
          {todoList.map((todo) => {
            return (
              <Todo
                id={todo.id}
                content={todo.content}
                complete={todo.complete}
                createdAt={todo.createdAt}
              />
            );
          })}
        </TodoWrapper>
      </List>
    </Wrapper>
  );
}
