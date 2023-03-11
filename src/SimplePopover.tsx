import { HoverCard } from "@kobalte/core";
import { createSignal } from "solid-js";

import hovercardStyles from "./css/hovercard.module.css";

interface PopoverProps {
  children: any;
  trigger: any;
  hoverCardProps?: any;
}

export default function SimplePopover(props: PopoverProps) {
  const { children } = props;
  const [isOpen, setOpen] = createSignal(false);

  return (
    <HoverCard.Root openDelay={200} closeDelay={0} {...props.hoverCardProps} isOpen={isOpen()} onOpenChange={setOpen}>
      <HoverCard.Trigger
        class={hovercardStyles.trigger}
      >
        <span
          class={hovercardStyles.trigger}
          onMouseEnter={() => setOpen(true)}
          onClick={() => setOpen(true)}
        >
          {props.trigger}
        </span>
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
