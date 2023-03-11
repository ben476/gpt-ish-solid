import { HoverCard } from "@kobalte/core";

import hovercardStyles from "./css/hovercard.module.css";

interface PopoverProps {
  children: any;
  trigger: any;
  hoverCardProps?: any;
}

export default function SimplePopover(props: PopoverProps) {
  const { children } = props;

  return (
    <HoverCard.Root openDelay={200} closeDelay={0} {...props.hoverCardProps}>
      <HoverCard.Trigger
        class={hovercardStyles.trigger}
      >
        {props.trigger}
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
