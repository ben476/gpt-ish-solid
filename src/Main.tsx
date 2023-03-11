import { Component, createEffect, createSignal } from 'solid-js';

import appStyles from "./css/App.module.css";
import Form from './Form';
import Viewer from './Viewer';

const Main: Component = () => {
  const [text, setText] = createSignal("")

  console.log(text())

  createEffect(() => {
    console.log(text())
  })

  return (
    <>
      <div class={appStyles.root}>
        <div>
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
