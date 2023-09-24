import { createMachine, assign } from "xstate";
import { useMachine } from "@xstate/react";

export const menuMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5SzAF1QSwHZVgfQFswsBXAOgGMAbAexQgGIaAHYgbQAYBdRUZujJhpZeIAB6IALAE4yAdg4BmDnMUBGAExq1HSdoA0IAJ6IArAA4O8uXPMA2PXcWSNi0wF93hlOmy5CxOQsxH4MEMJgZNgAbjQA1pE+mDj4RKRkwVh+CDE0FACGQlicXCWi-LCCGMKiEgh2plZ20qZ2cmq2khytcoYmCKbSVq0uGnY65m6K0p7eaMn+aUGsWTgMYABOGzQbZMxUhQBmOwRkSX6pgRkr2bkFRSVlSCAVVTXPdYqqZNLmauYWaYcDSmRQNPqIRTmWSSJymGRqaTKUxaWYgc4pALpagCNbhLCRXIJM7zC5Y8g4yo4HJYWL3arFbhPPgCIq1RAAWi0ZABKN00marma5ghCA0ch54rUii0knhfw0irRGMWV0ykAYlLAzJerIZ7PqclkCkUXzc4ukRo0orUDTIpkackkLjajQccmVpMxS2uxA1FAAFvkcNruOU9e9QHVJpIyBxtGoZI1XEpesZEBo-jy2goOk45aZbZ4vCAsDQIHBRCrLqRw5U2R9Oc0eQ6NPzBWDfqKOYMyG1M3ZJtINDJpGp4Z7fN6rlqIHW3iJGwgXKKRxKHKaQVLmjJzJOFjXliEcPOG1HId0+3oOOYXBxureRemBnINGRx6DJOYrSoPCXq+SlC0FSUCnvqS52OK9o3rocgNF00KmKK0zyJIUIAtIAqKiCMz-l6qrpOqc7PK8Z7iIgzRqHGpivqaMq2OY5jWs+UISgKbjusClpwZIxbuEAA */
  id: "settings_menu",
  initial: "closed",
  states: {
    closed: {
      on: {
        open: {
          target: "opening",
          actions: assign((_, event) => ({
            anchorEl: event.anchorEl,
            value: event.value,
          })),
        },
      },
    },
    opening: {
      invoke: {
        src: "readClipboard",
        onDone: [
          {
            target: "opened",
            actions: assign({
              clipboard: (context, event) => event.data,
            }),
          },
        ],
        onError: [
          {
            target: "opened",
          },
        ],
      },
    },
    closing: {
      invoke: {
        src: "menuClicked",
        onDone: [
          {
            target: "closed",
          },
        ],
      },
    },
    opened: {
      on: {
        close: {
          target: "closing",
          actions: assign({
            anchorEl: null,
            value: (_, event) => event.value,
          }),
        },

        change: {
          internal: true,
          actions: assign((_, event) => ({
            [event.name]: event.value,
          })),
        },
      },
    },
  },
});

export const useMenu = (onChange) => {
  const [state, send] = useMachine(menuMachine, {
    services: {
      menuClicked: async (context, event) => {
        onChange && onChange(event.value);
      },
      readClipboard: async () => false,
    },
  });
  const { anchorEl } = state.context;
  const handleClose = (value) => () =>
    send({
      type: "close",
      value,
    });
  const handleClick = (event, value) => {
    send({
      type: "open",
      anchorEl: event.currentTarget,
      value,
    });
  };

  const diagnosticProps = {
    id: menuMachine.id,
    states: menuMachine.states,
    state,
    send,
  };

  return {
    state,
    send,
    anchorEl,
    handleClick,
    handleClose,
    diagnosticProps,
  };
};
