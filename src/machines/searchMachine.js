import { createMachine, assign } from "xstate";

export const searchMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5SzAQwE4GMAWB9AtqjgJYB2YAdMRADZgDEA8gAoCiAcgNoAMAuoqAAOAe1jEALsWGkBIAB6IAjIoDMADgoB2AJwA2ACxr9AJkP7di4wBoQAT0QBaRbs0VF3btuNq1m-eZVNFQBfYJsUDBwCImwySkEyeghpSjIAN2EAa0oIrDxCEnIKBNIEdOFMVElpHl5a2RExapkkeUR-fQpuAFZtSz1TbqNtG3sEJ26ulRVtHUUg9X9dXVDwtDzowsoIdGFBJJSqUgzsilyogtiinb2y44qqqVJa+tbGiSfZBQQ+3Qo+-TudzdRSGLyjJTcTTcNyKbTmZzcfTcXTdYyrEDnfIxOIUPZgcgQCg0YSoCBkKAHIrlU5YzZXSj4wnE0nk0hQO4ZSrNF58BqiD7SL5KZzGCj+Zz6Py9TSaRQQhAGcXLbjTOXcRTdFT6DF0y64pmQCiYElidlU1L3WnrC44oqGokmgXszkPHl8V5CAXNYUIUHeCg+DXKVSaYyLBUOFTdGGeNQuXQa2aeFZhTE27FbPGCAlGklkyD0AAiACUWJ6QO8fa1vpYQW4VLptNpPKp9ENrHYlMYguK1I3vGplHpFLqM-SDTnmfmIIXmABJLh8t7ez419q6MX6FsaqX6GYeTQKtQaihN0wqRRqHtS7RqMeRTMM7O5okzwsAYQAMowAMqsCsqzXUBaz3ChjB7RsQR8NRmwVFRjBhbVtBjQE-B6eYQjTPU7UZKc81ZI0AFdSBJTBsggegyMyQDVyFdc-RBSZNC1YwvE8DwQQVNExV6fxtG1aNuhMLC1kfCd7Xwt9COk8jCxI6jaKaYC2j9UxtEDaMWOMK9um6XQVAVHROkQwJwyHTRrxY0I01IYRZ3gVocK2fllPokDEBmP4ej6NjN3bYZI33VxenjTRll6ITwofDZ9WpWgwFcwUWg8v0gTPW9YN8aNkV0SMEI0XwdM3Js1GEqUYttLMSiS6tUv8DRAW4a9mr01UpUMrs-SVYwhma5qUPCsLKqfXEbkEWqVO+PpFAoaZlBmaFN0QkYussWVAxauFVUs5RuhGiS8NfSb3NUyyVDmzd5lVAzMKPLqHF6uaoQPcKVA1VEDrio7p1ZCkTpS1T+1mgdrsbS8gnusZNzcLwZXaoYLP27Dx2+l9mSdM0oAB31-T+TVSqMSxuEQvK1vChsm0MUxNXmZGxNi3D0YIgsIBxhjh06VrwvcCxgTUBV90mTx-B0FD1GE5YvqZh0WVZigFIqCj2dSywTC6MqeZRZQegFrqeIoPjt0EvSROlrNZffWTlZXNzAdAu9A2hNFjK8eMjPhcCbrvAyOKHGzgiAA */
  id: "search_machine",
  initial: "idle",
  states: {
    idle: {
      on: {
        OPEN: "opened",
      },
    },
    pin: {
      invoke: {
        src: "pinSearch",
        onDone: [
          {
            target: "opened",
          },
        ],
      },
    },
    drop: {
      invoke: {
        src: "dropSearch",
        onDone: [
          {
            target: "opened",
          },
        ],
      },
    },
    opened: {
      initial: "loading",
      states: {
        loading: {
          invoke: {
            src: "loadSearches",
            onDone: [
              {
                target: "loaded",
                actions: assign({
                  searches: (context, event) => event.data,
                  open: true,
                }),
              },
            ],
          },
        },
        closing: {
          invoke: {
            src: "modalClose",
            onDone: [
              {
                target: "#search_machine.idle",
                actions: assign({
                  open: false,
                }),
              },
            ],
          },
        },
        loaded: {
          on: {
            DROP: {
              target: "#search_machine.drop",
              actions: assign({
                value: (context, event) => event.value,
              }),
            },
            PIN: {
              target: "#search_machine.pin",
              actions: assign({
                value: (context, event) => event.value,
              }),
            },
            CLOSE: {
              target: "closing",
              actions: assign({
                value: (context, event) => event.value,
              }),
            },
          },

          states: {
            unlocked: {
              on: {
                lock: "locked",
              },
            },

            locked: {
              on: {
                unlock: "unlocked",
              },
            },
          },

          initial: "unlocked",
        },
      },
    },
  },
});
