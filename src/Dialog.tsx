import { Dialog } from "@kobalte/core";
import { FiX } from "solid-icons/fi";
import { Show } from "solid-js";

import styles from "./css/Dialog.module.css";

interface DialogProps {
    trigger?: any;
    triggerChildren?: any;
    triggerProps?: any;
    title?: string;
    children: any;
    rootProps?: any;
}

export default function DialogE(props: DialogProps) {
    return (
        <Dialog.Root {...props.rootProps}>
            {props.trigger || (
                <Dialog.Trigger class={styles.trigger} {...props.triggerProps}>
                    {props.triggerChildren || "Open"}
                </Dialog.Trigger>
            )}
            <Dialog.Portal>
                <Dialog.Overlay class={styles.overlay} />
                <div class={styles.positioner}>
                    <Dialog.Content class={styles.content}>
                        <Show when={props.title}>
                            <div class={styles.header}>
                                <Dialog.Title class={styles.title}>{props.title}</Dialog.Title>
                                <Dialog.CloseButton class={styles.closeButton}>
                                    <svg
                                        fill="none"
                                        stroke-width="2"
                                        xmlns="http://www.w3.org/2000/svg"
                                        stroke="currentColor"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        viewBox="0 0 24 24"
                                        height="1.2em"
                                        width="1.2em"
                                        style="overflow: visible;"
                                    >
                                        <path d="M18 6 6 18M6 6l12 12"></path>
                                    </svg>
                                </Dialog.CloseButton>
                            </div>
                        </Show>
                        <Dialog.Description class={styles.description}>
                            {props.children}
                        </Dialog.Description>
                    </Dialog.Content>
                </div>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
