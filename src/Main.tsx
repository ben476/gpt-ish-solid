import { Accessor, Component, createEffect, createSignal, For, Index, Match, onCleanup, Setter, Show, Switch } from 'solid-js';
import { TextField, HoverCard, Button, Link, Dialog } from "@kobalte/core";

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
      <HoverCard.Trigger
        class={hovercardStyles.trigger}
      // href="javascript:void(0)"
      >
        {/* <span onmouseenter={() => {
        console.log("open")
        setOpen(true)
      }} onmouseleave={() => setOpen(false)}> */}
        {props.trigger}
        {/* </span> */}
      </HoverCard.Trigger>
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
        <SimplePopover trigger={<Button.Root class={textboxStyles.button} onClick={() => {
          setText(value())
        }} isDisabled={value().length < 1000}>
          Scan
        </Button.Root>}>
          GPT-ish works best with at least a few hundred words. We need a minimum of 1000 characters.
        </SimplePopover>
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
  const [error, setError] = createSignal("")
  const [creativity, setCreativity] = createSignal(0)
  let ref;

  createEffect(() => {
    // const evtSource = new EventSource("/api/v1/generate?text=" + encodeURIComponent(text()));

    // evtSource.onerror = (e) => {
    //   console.log(e)
    //   evtSource.close()
    //   setError("An error occurred while processing your request. Please try again later.")
    // }

    // evtSource.onmessage = (e) => {
    //   if (e.data == "<EOS>") {
    //     setDone(true)
    //     setCreativity(Math.round(100000 * (1 - [...tokens()].sort((a, b) => a.probability - b.probability)[Math.floor(Number(tokens().length * 0.9))].probability)))
    //     evtSource.close()
    //     return
    //   }

    //   try {
    //     const data = JSON.parse(e.data)

    //     console.log(data)

    //     setTokens((tokens) => [...tokens, data])
    //   } catch (e) {
    //     console.log(e)
    //     evtSource.close()
    //   }
    // };
    // (async () => {
    //   const req = await fetch("/api/v1/generate", {
    //     method: "POST",
    //     body: JSON.stringify({
    //       text: text()
    //     })
    //   })

    //   if (req.status != 200) {
    //     setError(`An error occurred while processing your request (${req.status}). Please try again later.`)
    //     return
    //   }

    //   const stream = await req.body?.getReader()

    //   if (!stream) {
    //     setError(`An error occurred while processing your request (no stream). Please try again later.`)
    //     return
    //   }

    //   let buffer = ""

    //   while (true) {
    //     const { done, value } = await stream.read()

    //     if (done) {
    //       setDone(true)
    //       setCreativity(Math.round(100000 * (1 - [...tokens()].sort((a, b) => a.probability - b.probability)[Math.floor(Number(tokens().length * 0.9))].probability)))
    //       break
    //     }

    //     buffer += new TextDecoder("utf-8").decode(value)

    //     const lines = buffer.split("\r\ndata: ").filter(a => a && a != "\r")

    //     buffer = lines.pop() || ""

    //     for (const line of lines) {
    //       if (line == "<EOS>") {
    //         setDone(true)
    //         setCreativity(Math.round(100000 * (1 - [...tokens()].sort((a, b) => a.probability - b.probability)[Math.floor(Number(tokens().length * 0.9))].probability)))
    //         return
    //       }

    //       try {
    //         const data = JSON.parse(line)

    //         console.log(data)

    //         setTokens((tokens) => [...tokens, data])
    //       } catch (e) {
    //         console.log(lines)
    //         console.log(e)
    //       }
    //     }

    //     // console.log(buffer)
    //   }
    // })();

    // const ws = new WebSocket("wss://api.gpt-ish.com/api/v1/generate")

    text()

    const ws = new WebSocket(window.location.origin.replace("http", "ws") + "/api/v1/generate")

    ws.onopen = () => {
      ws.send(text())
    }

    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data)

        console.log(data)

        setTokens((tokens) => [...tokens, data])

        ws.send("next")
      } catch (e) {
        console.log(e)
        ws.close()
      }
    }

    ws.onerror = (e) => {
      console.log(e)
      ws.close()
      setError("An error occurred while processing your request (websocket). Please try again later.")
    }

    ws.onclose = (e) => {
      setDone(true)

      const sorted = [...tokens()].sort((a, b) => a.probability - b.probability)

      setCreativity(Math.round(100000 * (1 - sorted[Math.floor(Number(tokens().length * 0.9))].probability)))
    }

    onCleanup(() => {
      setTokens([])
      setDone(false)
    })
  })

  createEffect(() => {
    console.log(tokens())
  })

  return (
    <div class={textboxStyles.checkText}>
      <h2>Results</h2>
      {/* <h3>{error() || (done() ? (
        creativity() > 50 ? "This text is most likely human written." :
          creativity() > 30 ? "This text is probably human written." :
            creativity() > 20 ? "This text could be human written." :
              creativity() > 10 ? "This text could be AI generated." :
                creativity() > 5 ? "This text is probably AI generated or from a well known source." :
                  "This text is most likely AI generated or from a well known source."
      ) : "Checking...")}</h3> */}

      <Show when={!error()} fallback={<h3>{error()}</h3>}>
        <Show when={done()} fallback={<h3>Checking...</h3>}>
          <Switch fallback={<h3>Something went wrong and we can't figure it out 🤔</h3>}>
            <Match when={creativity() > 50}>
              <h3>This text is most likely human written.</h3>
            </Match>
            <Match when={creativity() > 30}>
              <h3>This text is probably human written.</h3>
            </Match>
            <Match when={creativity() > 20}>
              <h3>This text could be human written.</h3>
            </Match>
            <Match when={creativity() > 10}>
              <h3>This text could be AI generated.</h3>
            </Match>
            <Match when={creativity() > 5}>
              <h3>This text is probably AI generated or has been seen many times on the internet.</h3>
            </Match>
            <Match when={creativity() >= 0}>
              <h3>This text is most likely AI generated or has been seen many times on the internet.</h3>
            </Match>
          </Switch>
          <h4>Creativity score: {creativity()}</h4>
        </Show>
      </Show>
      <div style={{ "text-align": "start", margin: "20px", "white-space": "pre-wrap" }}>
        <Index each={tokens()}>{(token) => (
          <SimplePopover trigger={<span style={{ "background-color": `rgba(100, 255, 100, ${Math.min(1 - Math.pow(token().place, -0.28), 1)})` }}>{token().word === "\n" ? <br /> : token().word}</span>}>
            <div>
              {/* <h3>Word probabilities</h3> */}
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
                  {Object.entries(token().top5).map(([word, probability]) => (
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
                    <td style={{ float: "left" }}>{token().word}</td>
                    <td style={{ float: "right" }}>{Math.round(token().probability * 1000) / 1000}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </SimplePopover>

        )}
        </Index>
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
    <>
      {/* <Dialog.Root>
      <Dialog.Trigger>
        <Link.Root>
        API
        </Link.Root>
      </Dialog.Trigger>
    <Dialog.
    </Dialog.Root> */}
      <div class={appStyles.root}>
        <div>
        </div>

        {/* <span onmouseenter={() => { console.log("hi") }}>
        Hallo
      </span> */}
        <h1>GPT-ish?</h1>
        {/* <p>
        Detect AI based plagiarism in assignments, essays, and other documents.
      </p> */}
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

export default App;
