import { createMachine, assign } from 'xstate';
import { useMachine } from "@xstate/react";


export const menuMachine = createMachine({
  id: 'settings_menu',
  initial: 'closed',
  states: {
    closed: {
      on: {
        open: {
          target: 'opening',
          actions: assign({
            anchorEl: (context, event) => event.anchorEl,
          }),
        },
      },
    },
    opening: {
      invoke: {
        src: 'readClipboard',
        onDone: [
          {
            target: 'opened',
            actions: assign({
              clipboard: (context, event) => event.data
            })
          }
        ],
        onError: [
          {
            target: 'opened'
          }
        ]
      }
    },
    closing: {
      invoke: {
        src: 'menuClicked',
        onDone: [
          {
            target: 'closed',
          },
        ],
      },
    },
    opened: {
      on: {
        close: {
          target: 'closing',
          actions: assign({
            anchorEl: null,
            value: (context, event) => event.value,
          }),
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
      readClipboard: async () => false
    },
  });
  const { anchorEl } = state.context;
  const handleClose = (value) => () =>
    send({
      type: "close",
      value,
    });
  const handleClick = (event) => {
    send({
      type: "open",
      anchorEl: event.currentTarget,
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
