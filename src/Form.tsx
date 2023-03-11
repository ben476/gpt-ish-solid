import { Button, TextField } from "@kobalte/core";
import { Accessor, createSignal, Setter } from "solid-js";

import SimplePopover from "./SimplePopover";
import textboxStyles from "./css/textbox.module.css";
import Dialog from "./Dialog";

interface FormProps {
  text: Accessor<string>;
  setText: Setter<string>;
}

export default function Form(props: FormProps) {
  const { text, setText } = props;
  const [value, setValue] = createSignal("");
  return (
    <div class={textboxStyles.checkText}>
      <TextField.Root
        class={textboxStyles.textarea}
        value={value()}
        onValueChange={setValue}
      >
        <TextField.TextArea
          placeholder="Enter text or upload file to detect AI based plagiarism in assignments, essays, and other documents."
          class={textboxStyles.el}
          style={{ height: "100%" }}
        />
      </TextField.Root>
      <div>
        <SimplePopover
          trigger={
            <Button.Root isDisabled class={textboxStyles.button}>
              Upload file
            </Button.Root>
          }
        >
          Coming soon!
        </SimplePopover>
        <SimplePopover
          trigger={
            <Button.Root
              class={textboxStyles.button}
              onClick={() => {
                setText(value());
              }}
              isDisabled={value().length < 1000}
            >
              Scan
            </Button.Root>
          }
        >
          GPT-ish works best with at least a few hundred words. We need a
          minimum of 1000 characters.
        </SimplePopover>
      </div>
    </div>
  );
}
