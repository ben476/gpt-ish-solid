import { Component, createEffect, createSignal } from "solid-js";

import appStyles from "./css/App.module.css";
import Dialog from "./Dialog";
import Form from "./Form";
import Viewer from "./Viewer";

const Main: Component = () => {
  const [text, setText] = createSignal("");
  const [apiOpen, setApiOpen] = createSignal(false);

  console.log(text());

  createEffect(() => {
    console.log(text());
  });

  return (
    <>
      <div class={appStyles.root}>
        <div
          style={{
            position: "fixed",
            top: "0",
            right: "0",
            padding: "18px 32px",
          }}
        >
          <Dialog
            triggerChildren="API Access"
            title="API Access"
            // triggerProps={{
            //   style: {
            //     background: "none",
            //     color: "inherit",
            //     border: "none",
            //     padding: 1,
            //     height: "2em",
            //   },
            // }}
            trigger={<a onClick={() => setApiOpen(true)}>API Access</a>}
            rootProps={{
              isOpen: apiOpen(),
              onOpenChange: setApiOpen,
            }}
          >
            Interested in an integration with your own apps and services? We'll
            be happy to help with any use case.
            <br />
            <br />
            Feel free to contact us at{" "}
            <a href="mailto:api@gpt-ish.com">api@gpt-ish.com</a>
          </Dialog>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <a href="https://dash.gpt-ish.com">Educator Dashboard</a>
        </div>
        <h1>GPT-ish?</h1>
        <div class={appStyles.card}>
          <Form text={text} setText={setText} />
        </div>
        <div class={appStyles.card} style={{ "margin-top": "80px" }}>
          {text() && <Viewer text={text} />}
        </div>
      </div>
    </>
  );
};

export default Main;
