import { Accessor, Component, createEffect, createSignal, Setter } from 'solid-js';
import { TextField, HoverCard, Button } from "@kobalte/core";

import logo from './logo.svg';
import styles from './App.module.css';
import hovercardStyles from "./hovercard.module.css";
import textboxStyles from "./textbox.module.css";
import appStyles from "./App.module.css";

interface PopoverProps {
  children: any;
  trigger: any;
  hoverCardProps?: any;
}

const SimplePopover: Component<PopoverProps> = (props) => {
  const { children } = props;
  const [open, setOpen] = createSignal(false);

  return (
    <HoverCard.Root openDelay={200} closeDelay={0} {...props.hoverCardProps}>
      {/* <HoverCard.Trigger
        class={hovercardStyles.trigger}
        href="javascript:void(0)"
      > */}
      <span onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
        {props.trigger}
      </span>
      {/* </HoverCard.Trigger> */}
      <HoverCard.Portal>
        <HoverCard.Content class={hovercardStyles.content}>
          <HoverCard.Arrow />
          {children}
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
};

interface FormProps {
  text: Accessor<string>;
  setText: Setter<string>;
}

const Form: Component<FormProps> = (props) => {
  const { text, setText } = props;
  const [value, setValue] = createSignal("");
  return (
    <div class={textboxStyles.checkText}>
      <TextField.Root class={textboxStyles.textarea} value={value()} onValueChange={setValue}>
        <TextField.TextArea placeholder="Enter text or upload file to detect AI based plagiarism in assignments, essays, and other documents." class={textboxStyles.el} style={{ height: "100%" }} />
      </TextField.Root>
      <div>
        <SimplePopover trigger={<Button.Root isDisabled class={textboxStyles.button}>
          Upload file
        </Button.Root>}>
          Coming soon!
        </SimplePopover>
        <Button.Root class={textboxStyles.button} onClick={() => {
          setText(value())
        }}>
          Scan
        </Button.Root>
      </div>
    </div>
  );
};

interface ViewerProps {
  text: Accessor<string>;
}

interface Token {
  token: string;
  word: string;
  probability: number;
  place: number;
  top5: {
    word: string;
    probability: number;
  }
}

const Viewer: Component<ViewerProps> = (props) => {
  const { text } = props;
  const [tokens, setTokens] = createSignal<Token[]>([])
  const [done, setDone] = createSignal(false)

  createEffect(() => {
    setTokens([])

    const evtSource = new EventSource("/api/v1/generate?text=" + encodeURIComponent(text()));

    evtSource.onmessage = (e) => {
      if (e.data == "<EOS>") {
        setDone(true)
        evtSource.close()
        return
      }

      try {
        const data = JSON.parse(e.data)

        console.log(data)

        setTokens((tokens) => [...tokens, data])
      } catch (e) {
        console.log(e)
      }
    };
  })

  createEffect(() => {
    console.log(tokens())
  })

  return (
    <div class={textboxStyles.checkText}>
      <h2>Results</h2>
      <h3>{done() ? "Creativity score: " + Math.round(1000 * (1 - [...tokens()].sort((a, b) => a.probability - b.probability)[Math.round(Number(tokens().length * 0.9))].probability)) : "Checking..."}</h3>
      <div style={{ "text-align": "start", margin: "20px" }}>
        {tokens().map((token) => (
          <SimplePopover trigger={<span style={{ "background-color": `rgba(255, 100, 100, ${Math.min(1 - Math.pow(token.place, -0.28), 1)})` }}>{token.word}</span>}>
            <div>
              <h3>Word probabilities</h3>
              {/* <ul style={{ "list-style-type": "none", "padding-left": "0px" }}>
                {Object.entries(token.top5).map(([word, probability]) => (
                  <li>{word}&nbsp&nbsp&nbsp:{probability}</li>
                ))}
              </ul> */}
              <table style={{ "width": "100%" }}>
                <thead>
                  <tr>
                    <th style={{ float: "left" }}>Word</th>
                    <th style={{ float: "right" }}>Probability</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(token.top5).map(([word, probability]) => (
                    <tr>
                      <td style={{ float: "left" }}>{word}</td>
                      <td style={{ float: "right" }}>{Math.round(Number(probability) * 1000) / 1000}</td>
                    </tr>
                  ))}
                  <tr>
                    <td style={{ float: "left" }}>...</td>
                    <td style={{ float: "right" }}>...</td>
                  </tr>
                  <tr>
                    <td style={{ float: "left" }}>{token.word}</td>
                    <td style={{ float: "right" }}>{Math.round(token.probability * 1000) / 1000}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </SimplePopover>

        ))}
      </div>
    </div>
  )
}


const App: Component = () => {
  const [text, setText] = createSignal("")

  console.log(text())

  createEffect(() => {
    console.log(text())
  })

  return (
    <div class={appStyles.root}>
      <div>
      </div>
      <h1>GPT-ish</h1>
      {/* <p>
        Detect AI based plagiarism in assignments, essays, and other documents.
      </p> */}
      <div class={appStyles.card}>
        <Form text={text} setText={setText} />
      </div>
      <div class={appStyles.card} style={{ "margin-top": "80px" }}>
        {text() && <Viewer text={text} />}
      </div>
    </div >
  );
};

export default App;
