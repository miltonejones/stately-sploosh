import { createMachine, assign } from "xstate";

export const carouselMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QGMCGAnA9gV1mANgHT6aoQDEEmAdmIQJbUBumA1nWlrgcaRAoxZoALvRoBtAAwBdKdMSgADplj1RNBSAAeiALQBmfQFZCRgCz6AnJMkBGOwCYA7PttGANCACee64Uu2AGyBlmbmtk6WABxGlgC+cZ6cOHhEUJjkWrDCqMJ0qABmeegAFPY2AJTkydxpmHKayqrq1Jo6CA76koS2tlGSVpJmgYZRnj4Iug4Olv4OtjOdkkaSDnYJSRgpPNmYipnZuflFYKWBNpJVNamEu4oNSCBNamKtj+1Bs0b6UbbRktEok4nMtxoggYR9E4ZkNPlDAlENiBrjthHtyLQtMIHkoVC8NO9EEsen0BtZhqMBmDJpYnKZpmt9NMmZInEZEUjqJgIHBNCj8I08S02npAkYTFEzAFjGEpSN9NSDBFCGZ5kzXBq+mEkfzeGRBc1XiLJuc6ZLpeZzJZ5YrLPoetZekF2ZZxVF4olkVtaoR0gb8W9QO0zFEooROr1+q7abTbGZFU4zIRIkZAs4QYzU4Edd6bnd-cLCZMzEmjG40x5vKLZiE7LDgg3ggkEkA */
    id: "carousel",
    initial: "load",
    states: {
      load: {
        invoke: {
          src: "loadImages",
          onDone: [
            {
              target: "stop",
              actions: "assignImages",
            },
          ],
        },
      },

      go: {
        after: {
          1000: {
            target: "stop",
            actions: "nextImage",
          },
        },
      },

      stop: {
        after: {
          6000: {
            target: "go",
            actions: "assignImage",
            cond: "autorun is true",
          },
        },

        on: {
          next: {
            target: "go",
            actions: "assignImage",
          },
        },
      },
    },
  },
  {
    actions: {
      // load initial images
      assignImages: assign((_, event) => {
        const images = event.data;
        if (!images) return;
        return {
          images,
          index: 0,
          first: images[0],
          second: images[1],
        };
      }),
      // assign first and second image
      assignImage: assign((context) => {
        const { images, index, second } = context;
        if (!images) return;
        const first = images[index % images.length];
        // const second = images[(index + 1) % images.length];
        return {
          first,
          second,
          running: true,
          // increment index here
          index: index + 1,
        };
      }),
      // move second image into first position
      nextImage: assign((context) => {
        const { images, index } = context;
        if (!images) return;
        const first = images[index % images.length];
        return {
          first,
          running: false,
        };
      }),
    },
    guards: {
      "autorun is true": (context) => !!context.autorun,
    },
  }
);
