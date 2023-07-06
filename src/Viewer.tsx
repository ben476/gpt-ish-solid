import {
  Accessor,
  createEffect,
  createSignal,
  Index,
  Match,
  onCleanup,
  Show,
  Switch,
} from "solid-js";
import { FiExternalLink } from "solid-icons/fi";

import SimplePopover from "./SimplePopover";
import Dialog from "./Dialog";
import textboxStyles from "./css/textbox.module.css";

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
  };
}

export default function Viewer(props: ViewerProps) {
  const { text } = props;
  const [tokens, setTokens] = createSignal<Token[]>([]);
  const [done, setDone] = createSignal(false);
  const [error, setError] = createSignal("");
  const [creativity, setCreativity] = createSignal(0);

  createEffect(() => {
    text();

    const ws = new WebSocket(
      window.location.origin.replace("http", "ws") + "/api/v1/generate"
    );

    ws.onopen = () => {
      ws.send(text());
    };

    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);

        console.log(data);

        setTokens((tokens) => [...tokens, data]);

        ws.send("next");
      } catch (e) {
        console.log(e);
        ws.close();
      }
    };

    ws.onerror = (e) => {
      console.log(e);
      ws.close();
      setError(
        "An error occurred while processing your request (websocket). Please try again later."
      );
    };

    ws.onclose = (e) => {
      setDone(true);

      const sorted = [...tokens()].sort(
        (a, b) => a.probability - b.probability
      );

      setCreativity(
        Math.round(
          100000 *
            (1 - sorted[Math.floor(Number(tokens().length * 0.9))].probability)
        )
      );
    };

    onCleanup(() => {
      setTokens([]);
      setDone(false);
      setError("");
    });
  });

  createEffect(() => {
    console.log(tokens());
  });

  return (
    <div class={textboxStyles.checkText}>
      <h2>Results</h2>
      <Show when={!error()} fallback={<h3>{error()}</h3>}>
        <Show when={done()} fallback={<h3>Checking...</h3>}>
          <Switch
            fallback={
              <h3>Something went wrong and we can't figure it out 🤔</h3>
            }
          >
            <Match when={text.length < 1000}>
              <h3>This text is to short to make a decision.</h3>
            </Match>
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
              <h3>
                This text is probably AI generated or has been seen many times
                on the internet.
              </h3>
            </Match>
            <Match when={creativity() >= 0}>
              <h3>
                This text is most likely AI generated or has been seen many
                times on the internet.
              </h3>
            </Match>
          </Switch>
          <h4>Creativity score: {creativity()}</h4>
        </Show>
      </Show>
      <Dialog
        title="Word probability"
        triggerChildren={
          <>
            Learn more
            <FiExternalLink style={{ "margin-left": "5px" }} />
          </>
        }
        triggerProps={{
          style: {
            background: "none",
            color: "inherit",
            border: "none",
            padding: 1,
            height: "2em",
          },
        }}
      >
        When you ask an AI to write something for you, a neural network takes in
        the previous text (if any) and then, for every possible token (think of
        them as parts of a word), generates the probability of that particular
        token coming next. It then picks the most* probable token and does this
        process again until your whole text is generated.
        <br />
        <br />
        The idea that the AI will always pick one of the most likely tokens is
        the basis for GPT-ish. By running a modified version of a GPT-like
        text generator, we can get the probability distributions for each token
        in the text and allow us to check if they're all just the most likely
        choices (like what an AI would do) or if there's more human-like
        variation.
        <br />
        <br />
        <p style={{ "font-size": "0.8em" }}>
          *Actually, a technique called temperature sampling picks some less
          likely tokens at times to make your text more interesting.
        </p>
      </Dialog>
      <div
        style={{
          "text-align": "start",
          margin: "20px",
          "white-space": "pre-wrap",
        }}
      >
        <Index each={tokens()}>
          {(token) => (
            <SimplePopover
              trigger={
                <span
                  style={{
                    "background-color": `rgba(100, 255, 100, ${Math.min(
                      1 - Math.pow(token().place, -0.28),
                      1
                    )})`,
                  }}
                >
                  {token().word === "\n" ? <br /> : token().word}
                </span>
              }
            >
              <div>
                <table style={{ width: "100%" }}>
                  <thead>
                    <tr>
                      <th style={{ float: "left" }}>Word</th>
                      <th style={{ float: "right" }}>Probability</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(Object.entries(token().top5) as [string, number][])
                      .slice(0, 5)
                      .sort((a, b) => b[1] - a[1])
                      .map(([word, probability]) => (
                        <tr>
                          <td style={{ float: "left" }}>{word}</td>
                          <td style={{ float: "right" }}>
                            {probability}
                            {/* {Math.round(Number(probability) * 1000) / 1000} */}
                          </td>
                        </tr>
                      ))}
                    <tr>
                      <td style={{ float: "left" }}>...</td>
                      <td style={{ float: "right" }}>...</td>
                    </tr>
                    <tr>
                      <td style={{ float: "left" }}>{token().word}</td>
                      <td style={{ float: "right" }}>
                        {Math.round(token().probability * 1000) / 1000}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </SimplePopover>
          )}
        </Index>
      </div>
    </div>
  );
}
