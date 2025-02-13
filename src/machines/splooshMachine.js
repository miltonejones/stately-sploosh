import { createMachine, assign } from "xstate";

export const splooshMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5SwA4BsD2HYAsD6AtgIYDGOAlgHZgB0ERuAxAGoCSAIgKIDyA2gAwBdRKBTZyAF3IZKIkAA9EARgAsKmkoBs2zQGZ+-XSoCs2gDQgAnogBM-GzRvGDhlQA47mpW80BfXxaomNj4xGRUtPRMALLcXAAyAsJIIGKwktKyKYoISgCc6lo6+q6mmhbWCDZ5xgDsNG78ebo2eppObrpu-oHoWLiEpBTUdAw4jADKnACCAEoAwgASSXJpGTJyOUrGhTp6BkZlFbbGDrXO9kq1eXa1Nio9IEH9oUMRo0wAYtPM3LOsABVOCsUmspBtsspartigcTOYrLY3KYGk1dBd+G4VPYHgEnn0QoNwiMouNZpx5pwAHIAkGicTgrKgLZYjR7EqHBGVar8er6Zpdbw7ZqPZ6EsLDSJjRhLaZUgDiwKEqwZmU2iBUmhoehsjXsuk0tS6BuOCH07hoBXRzRuxjy51FBIGEvesCIADcwIwIDJaFR3RgANa0MXOt4jN2ehD+jAkIiMpJ01KqiHM2yG4yOfjGTqagqa3SmpS6bw0EutJwGpTVwyO4Jh4m0d3kCBgbB4TBEVsQGgAJzAXaoUG9vpoMeDNFDr0bNGbrfbne7fYHECH0coAbjCaESbBashVRsXRotVq7U6hpUShstSLht0lpu2O0xt0tW6eKnRMls5bbdgHYYF2kA0IuQ4jiM44hk604-nO-6AcBPZgZQUDrpu8aZImyqgimTIKMoPj8Ce1RXvoVz8PkeR3kaj73PwL6dG+H69PWsHvPBC5AUui6QIw7DTBMyw4fS6SMuquRGGysKlJoximm4Sg0BiaLNMYWi4qxLzfhxf5cUhoHcXxUxzEsu54RJWgMSeahuHkeTVt49g2EW-AqHk2pNFeWL3HaNhKHW2kuiMnEAbxyFGRAjDfL8-xAuZYn7mmuRtDZ7j2Y5jQ2C5iK5PZD6aPZcm1N4cmKX4n4wTpIV6WFkWGUhjDkpSNIJes+FbKl0LpQ51ZZTl3JHpmVGaCYBoGncgXiuGTa1YhPGRZMPxKskontRJrTIlmOZGIVah6EW2KZuVzQMTUmJ5FNDZwXN4UNd2-HcNE0ysFSbXiQeVlat1dm9U52VFtsxGaKpKinm4p7old7E1fOdUGeFLAcDw71JQRKXWT9GV9c5pp6OoY35NmBT2iKlVsdVs1w-NIGI7ECSo6m6NaAaaW-ZluO5TeFpvgU75dBDtTQ5Tv7U3diNTLSInJolTM5Pc2zKd5dhNODnR3vYNCUTmzjFgxVzC8FVMIeLi2ygqK0qrLHW2Ni9Rg1o-mavY5xFs4WoMa0KjZVcDlGIbM2iyb9WIwACos3AAnw0t7nLti1Nm225ntBZFgnD7ZSWZTIiVegBzOoU0xFjWLDMsxS6tMvrQerQ1Enu35gduXbNWZZaD4xYOXkdm6PnN1iyHi3sLM3Ch4zNtmnUxHbIVPlg3JKh3u02rXMYRi9fcl3k0FgeF6bjXkp85JCePlkg99tnY-9A3KEoBgaF5DEg+3rR9+8-YAGb9kwPqQRuQbQQpkbZcX84A4HQrGTCMhsKV1jhPQ0xF-LojkgxYwOx0SHXtBoey0ISwlTfBVLS00Zyf2-uMX+fp-4Ti-MA0hYCIFbiwjuJQsCLIHjuIg4sph3ZoJUBg5uRVtRFTyLyewzQ3AsXxEAwOdCf6jigpOKqtCwCgNwAwqBlBEw2FYdbCSCdOHIJ4eg+Szd3wOCoo0dExZCr2TfiMWR5D5FUMATvEhKiyHqO3IIXgugdHV2SiVAx3DUHGKLCTbB9oDRuWytmTSUjXE-gcRBShAZqFKJke4+hMZGHQJ3CoPxH1kqaEaI4LhKC5KhObjsdQNjFIXmYvaOxtAkkULHM4xR0i3GqPAdkjRiZjAFLRjkQqQTym8P4ZUbYNwIk9zQe0Qwvdt7EMSZkuRf9UkuOWe-VZPT-45M0TuTQgy44pRhC+OERwuZ2nULmFwIipnGCaTQFAOAMASAwHgAArigegEgvStIUTQwOLy3kfO+b8sAnimHeJjmw5KXtMx2B2nmfahYubtA8tecR2ZWh3F0Isoh11XRgAkHgD+HoMC9kkP8pxGyOkJOJaS8lAYqV-KhbkmFxyJ64sRdmZOjc0Xcjko4C4R53C82vE8iAvYMAoBoGQMAJBAwAAJpWyuVUQXsUBYCMFPgeN8p5LRXmrGRCG41TT+WmcUm44jdSFSlTKuVCqlWqsdRqrVOreAsKtv49GXRMRlnfIVdSlEE5GgtS0Gpdlsq6kML9Qh8StkkkdXQN16RUJoDAMqziyS2l0qBTONVcqi3KvTVATN2a9LsoOZyn1hS-V2DcA0Owjss6ak1Ba7wTb072S9iI7uDrZWpvVdQeQEhK3zlzYC9JhaU0ltHeOzi1aYF1qGYgA0dllLOBLMiONbgLXOEzM4OyV4jR3D4YOuVMBx0EEpVm0KurYW6P1fkbt-JGIiJKiY7kIj1DQj0PkMGZ4vCXpoNe5Vt7+wTv-Lq71uFn3wvfB5Y0lq1LBsFbYX9NkAN82AwFJZRLYZtjwGAXsMrexNQpNwZgnBZh6uSoB6S5zZLlFyiWPQylkEd2qKeJ5nF7rgQBe0gt-c2wCdQsuncT7fVbCRZafGdk3IZVaKaLo6gMTbAkfra4fG9LieHKR8jzy0Dxg-pSgg9Kk3GwwPpyTtb4MyeUHJvICnf3KdY5UIDNBCYlEcvcOJIn3i3tbGgfTU7hMzp-MFsAoWUJoV6V4+jzMTWeTUPaX63dkQWpfMpTo2U-ZXgTYFkY0XYvcXAoZylxnTPmcs4R2gpXbMJehUlrYJZiISOFHwtyHgWgWu7g+Roft5npa3oSmGtBmWUupbAMLQn82RfeFN1lcAmt7L6VJrllkWgOD4fcaolYbx3DTk0EieCjB8JPULAjE2aDLZm2FyrvZqsSDM72CzxXJsUpW7NuLdnWvKB295yNB215HZvrkRSD5Il3zuDoSiTz+wkDAJQCQc3aUALq7dpHKO0d-eaxygHklnDyaiQQiG7QPO2HROoEm5x7KdDspIz7y5keo8e2Rqr6AavvaxyLHH7P8frcS9J+tbWScubJ2eCnKmuZqHqCI6oRh-X+aebAAcvYyDo-WZjln6vNVa6FxhEXW3PoVm83oU4o1cXVFNKeLUNqjTe2RO5SVN2Rb681zgDnRnuevdq3rjXhvysSYJzWon15l4Fit97Q0tvco+A8hIm8EigbbDPFKjAxAqDa5SbrxbJIs9EBz0byBJvV0nOvKcbz1wNJXE6N3N2WgtYtst-i7MblM-Z8oD7rnJn-e85Zz6bva3jctdF2u3IThdu19GvX3Qjfm4gybZE-F1wleNMeJQDArZ4ApE+xXieABaJSE0qJnhaF4PQHhTRH8zPZeydRu5NGrEaZnBepS4EPxJMGqnVBJ5c0aG8C6ENDG0TXq0nA9DAG-xrjNUtAhlUCV1OABmbgX3MU2mLFwUhmu3GxFj3kihgIYxBgfCxj+n6kOlLFMCcHtEziuACw-yDn0iXH7EHFQkIPRjsDBiEUUhoPPzkhogcH8h7kaB7gMHf06VEyYNphDygHYM6nUjZivnIKXzuFKWEIuhKHEIZSIykOLm7DkNtl5AaBAOxFj1DROwcEAOaHOGrFGl5ERx2QMIQFsgfivHESNB2DaAPQTjLHxRuHuCxBsPoIkPeBBXeS+R+XjGgIczFyRE6HgJKm9jUhjQPQkRPGvCZzvk7hwPANu3VyZW+2pScN1Fom7kSKQJSObncnqEp0aDBlQVUHw1wOASLScKzmIiNCaA-V5G2AtVQQ0CxDtCJl8mLFA2dRVRLU1W1ScOxDfHk3ODsgv1uE7QcgGJuCaGqGcHfFAxLTLQrU4jaOcAcFMAogTk7gkU7Wr2KT2zn2uVMB2LdQXWgwwDaOhHqDQUMCFD3QtR8HU0xGT2KUxDX1A3A0g3vVqjaPuBIPxWKV1DXh3QPVaBPHRGcG9jfChN03nBI0517CcLr0ULIM5kmSYgiX0QIWyi0Ks0YKcJuAfEojck7n0DqCyzY1KOqGv09iuBNUxLEzixpJKi1jvjIlOmZO-Q1C8G83ZM6GzEKjviKwYNK35KUnl2tRKhvG0DFKqFSncCvH1gMHyDXieUaz5JiMnyyI8hVMWOvGA01JvCPHgKvBDRJkOCeXuz+T3zWliNyHsGGh0F7TQUQIhy5OIjSw8KxGaDtNdMKPdP0zxN5AfCKBsScHUm9iDOuAV2qJELUCfhyJZwFwkDjKcCY39JTJQO5Au0DRqAxQxVzIYPzNjNNMr3jOLNtFLIhyhKUghhc15BqFPC6LVyDxwBpOFUTJLMQKUDt20DLD8lMH1HtAdHd2AU92D1YNkMbIniyITL9NbPHIUjXgaDtHIkogQNrJCML272HN9O0DHNTLdkTjSw8BzAcmlOCO0MiCLxLxkLjOLBbOTMDLdmmRJghn+OKn8H8CAA */
    id: "sploosh_machine",
    initial: "dash",
    states: {
      dash: {
        on: {
          VIDEO: {
            target: "video",
          },
          MODEL: {
            target: "#sploosh_machine.model",
            actions: assign({
              page: 1,
            }),
          },
          SEARCH: "#sploosh_machine.search",
          FAVORITE: "#sploosh_machine.favorites",
          RECENT: "#sploosh_machine.recent",
          CHANGE: {
            actions: assign({
              search_param: (context, event) =>
                event.value || context.search_param,
              debug: (context, event) => event.debug,
            }),
          },
        },
      },

      save: {
        invoke: {
          src: "saveSearch",
          onDone: [
            {
              target: "videos_loaded",
            },
          ],
        },
      },

      videos_loaded: {
        initial: "loading",
        states: {
          reading: {
            invoke: {
              src: "getParam",
              onDone: [
                {
                  target: "loaded",
                  actions: assign({
                    search_param: (context, event) => event.data,
                  }),
                },
              ],
            },
          },
          loading: {
            invoke: {
              src: "getSearches",
              onDone: [
                {
                  target: "reading",
                  actions: assign({
                    tabs: (context, event) => event.data,
                  }),
                },
              ],
            },
          },
          loaded: {
            on: {
              DASH: "#sploosh_machine.dash",
              SEARCH: "#sploosh_machine.search",
              FAVORITE: "#sploosh_machine.favorites",
              RECENT: "#sploosh_machine.recent",
              SAVE: {
                target: "#sploosh_machine.save",
                actions: assign({
                  value: (context, event) => event.value,
                }),
              },
              DOMAIN: {
                target: "#sploosh_machine.domain",
                actions: assign({
                  page: 1,
                  domain: (context, event) => event.param,
                }),
              },
              VIDEO: {
                target: "#sploosh_machine.video",
                actions: assign({
                  page: 1,
                  search_param: "",
                }),
              },
              MODEL: {
                target: "#sploosh_machine.model",
                actions: assign({
                  page: 1,
                }),
              },
              SET: {
                actions: assign((context, event) => ({
                  [event.key]: event.value,
                })),
              },
              CHANGE: {
                actions: assign({
                  search_param: (context, event) => event.value,
                  debug: (context, event) => event.debug,
                }),
              },
              PHOTO: {
                target: "#sploosh_machine.photo_update",
                actions: "assignPhotoData",
              },
              HEART: {
                target: "#sploosh_machine.set_favorite",
                actions: "assignPhotoData",
              },
              DROP: {
                target: "#sploosh_machine.drop",
                actions: "assignPhotoData",
              },
              REFRESH: "#sploosh_machine.refresh",
            },
          },
        },
      },

      refresh: {
        invoke: {
          src: "refreshList",
          onDone: [
            {
              target: "#sploosh_machine.video",
              cond: "is video view",
            },
            {
              target: "#sploosh_machine.model",
              cond: "is model view",
            },
            {
              target: "#sploosh_machine.favorites",
              cond: "is favorites view",
            },
            {
              target: "#sploosh_machine.recent",
              cond: "is recent view",
            },
            {
              target: "#sploosh_machine.search",
              cond: "is search view",
            },
            {
              target: "#sploosh_machine.domain",
              cond: "is domain view",
            },
            {
              target: "#sploosh_machine.dash",
            },
          ],
        },
      },

      photo_update: {
        invoke: {
          src: "updatePhoto",
          onDone: [
            {
              target: "#sploosh_machine.refresh",
            },
          ],
        },
      },

      set_favorite: {
        invoke: {
          src: "setFavorite",
          onDone: [
            {
              target: "#sploosh_machine.refresh",
            },
          ],
        },
      },

      drop: {
        states: {
          "check drop args": {
            always: [
              {
                target: "drop single video",
                cond: "is a single ID",
              },
              {
                target: "drop next video",
                actions: "assignDoomed",
              },
            ],
          },

          "drop single video": {
            invoke: {
              src: "dropVideo",
              onDone: "#sploosh_machine.refresh",
            },
          },

          "drop next video": {
            invoke: {
              src: "dropVideo",
              onDone: {
                target: "get more videos",
                actions: "assignDoomed",
              },
            },
          },

          "get more videos": {
            always: [
              {
                target: "drop next video",
                cond: "more delete events",
              },
              "#sploosh_machine.refresh",
            ],
          },
        },

        initial: "check drop args",
      },

      video_error: {
        on: {
          RECOVER: {
            target: "#sploosh_machine.dash",
          },
        },
      },

      video: {
        initial: "loading",
        states: {
          loading: {
            invoke: {
              src: "loadVideos",
              onDone: [
                {
                  target: "#sploosh_machine.videos_loaded",
                  actions: assign({
                    videos: (context, event) => event.data,
                    view: "video",
                  }),
                },
              ],
              onError: [
                {
                  target: "#sploosh_machine.video_error",
                  actions: "assignProblem",
                },
              ],
            },
          },
        },
      },

      model: {
        initial: "loading",
        states: {
          loading: {
            invoke: {
              src: "loadModels",
              onDone: [
                {
                  target: "#sploosh_machine.videos_loaded",
                  actions: assign({
                    models: (context, event) => event.data,
                    view: "model",
                  }),
                },
              ],
              onError: [
                {
                  target: "#sploosh_machine.video_error",
                  actions: "assignProblem",
                },
              ],
            },
          },
        },
      },

      favorites: {
        initial: "loading",
        states: {
          loading: {
            invoke: {
              src: "loadFavorites",
              onDone: [
                {
                  target: "#sploosh_machine.videos_loaded",
                  actions: assign({
                    videos: (context, event) => event.data,
                    view: "favorites",
                  }),
                },
              ],
              onError: [
                {
                  target: "#sploosh_machine.video_error",
                  actions: "assignProblem",
                },
              ],
            },
          },
        },
      },

      recent: {
        initial: "loading",
        states: {
          loading: {
            invoke: {
              src: "loadRecentVideos",
              onDone: [
                {
                  target: "#sploosh_machine.videos_loaded",
                  actions: assign({
                    videos: (context, event) => event.data,
                    view: "recent",
                  }),
                },
              ],
              onError: [
                {
                  target: "#sploosh_machine.video_error",
                  actions: "assignProblem",
                },
              ],
            },
          },
        },
      },

      search: {
        initial: "loading",
        states: {
          loading: {
            invoke: {
              src: "searchVideos",
              onDone: [
                {
                  target: "#sploosh_machine.videos_loaded",
                  actions: assign({
                    videos: (context, event) => event.data,
                    view: "search",
                  }),
                },
              ],
              onError: [
                {
                  target: "#sploosh_machine.video_error",
                  actions: "assignProblem",
                },
              ],
            },
          },
        },
      },

      domain: {
        initial: "loading",
        states: {
          loading: {
            invoke: {
              src: "loadDomain",
              onDone: [
                {
                  target: "#sploosh_machine.videos_loaded",
                  actions: assign({
                    videos: (context, event) => event.data,
                    view: "domain",
                  }),
                },
              ],
              onError: [
                {
                  target: "#sploosh_machine.video_error",
                  actions: "assignProblem",
                },
              ],
            },
          },
        },
      },
    },
    context: { page: 1, search_param: "" },
    predictableActionArguments: true,
    preserveActionOrder: true,
  },
  {
    guards: {
      "is a single ID": (context) => {
        const single =
          !!context.ID && !(!!context.doomed && !!context.doomed.length);
        if (single) {
          // window.alert("single!");
          return true;
        }
        // window.alert("Multi!");
        return false;
      },
      "is video view": (context) => context.view === "video",
      "is model view": (context) => context.view === "model",
      "is favorites view": (context) => context.view === "favorites",
      "is recent view": (context) => context.view === "recent",
      "is search view": (context) => context.view === "search",
      "is domain view": (context) => context.view === "domain",
      "more delete events": (context) => {
        const more = !context.doomedComplete; // !!context.doomed && !!context.doomed.length;
        if (more) {
          return true;
        }
        // window.alert("No more to delete");
        return false;
      },
    },
    actions: {
      assignProblem: assign((context, event) => {
        return {
          errorMsg: event.data.message,
          stack: event.data.stack,
        };
      }),
      assignPhotoData: assign((context, event) => {
        const length = event.doomed?.length;
        return {
          ID: event.ID,
          src: event.src,
          doomed: event.doomed,
          doomedComplete: false,
          doomedLength: length,
        };
      }),

      assignDoomed: assign((context) => {
        const items = context.doomed;
        const ID = items.pop();
        const progress = 100 * (items.length / context.doomedLength);
        console.log({ ID, progress, items });

        return {
          ID,
          progress,
          doomed: items,
          doomedComplete: !ID,
        };
      }),
    },
  }
);
