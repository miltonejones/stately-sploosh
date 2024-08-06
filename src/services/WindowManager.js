import React from "react";
import Observer from "./Observer";
import { VideoPersistService } from "./VideoPersist";

// 0.56

// export const WINDOW_REGIONS = [
//   {
//     width: 760,
//     height: 428,
//     x: 0,
//     y: 0,
//   },
//   {
//     width: 840,
//     height: 480,
//     x: 760,
//     y: 0,
//   },
//   {
//     width: 640,
//     height: 360,
//     x: 0,
//     y: 600,
//   },
//   {
//     width: 480,
//     height: 280,
//     x: 640,
//     y: 600,
//   },
//   {
//     width: 480,
//     height: 280,
//     x: 1120,
//     y: 600,
//   },
// ];

export const WINDOW_REGIONS = [
  {
    width: 960,
    height: 538,
    x: 0,
    y: 0,
  },
  {
    width: 960,
    height: 538,
    x: 960,
    y: 0,
  },
  {
    width: 640,
    height: 360,
    x: 0,
    y: 600,
  },
  {
    width: 640,
    height: 360,
    x: 640,
    y: 600,
  },
  {
    width: 640,
    height: 360,
    x: 1280,
    y: 600,
  },
];

class WindowManagerService$ {
  launched = [];
  sidebarOpened = !1;
  index = 0;
  constructor() {
    window.addEventListener("unload", () => this.exit());
  }
  quickSize(re, src) {
    const regex = /embed\/(\d+)\/(\d+)\/(\d+)\/(\d+)/.exec(src);
    let out = src;
    if (regex) {
      const str = `embed/${regex[1]}/${regex[2]}/${re.width}/${re.height}`;
      out = out.replace(regex[0], str);
    }

    return out;
  }

  javdoeCustom(video, w, h) {
    return video.URL + `#${w}/${h}`;
  }

  region(video, index = 0) {
    const re = WINDOW_REGIONS[index % WINDOW_REGIONS.length];
    re.on = !0;
    re.src = video.image;

    const address =
      video.src?.indexOf("javdoe.to") > 0
        ? this.javdoeCustom(video, re.width, re.height)
        : this.quickSize(re, video.src);
    // alert([address, video.src, this.quickSize(re, video.src)].join("<--->"));
    return window.open(
      address,
      `region_${index}`,
      `width=${re.width},height=${re.height},toolbar=0,location=0,left=${re.x},top=${re.y}`
    );
  }
  focus() {
    this.launched
      // .sort((a, b) => (a.index < b.index ? 1 : -1))
      .map((app) => app.window && app.window.focus());
  }
  async launch(video, index = 0) {
    try {
      await VideoPersistService.add(video);
    } catch (e) {
      console.log({ e });
    }
    this.launched.push({
      video,
      index,
      window: this.region(video, index),
    });
    this.index++;
    setTimeout(() => this.focus(), 99);
  }
  visited(video) {
    return !!this.launched.filter((f) => f.video.ID === video.ID).length;
  }
  exit() {
    this.launched.map((f) => f.window.close());
    this.launched = [];
  }
  peek() {
    return !!this.launched.length;
  }
  jav(item) {
    let re = /([a-z|A-Z]+-\d+)/.exec(item.title);
    if (re) {
      window.open(this.javLibrarySearchLink(re[1]));
      return;
    }
    window.open(item.URL);
  }
  googlePhotoLink(title) {
    return `https://www.google.com/search?q=${title.replace(
      /\s/g,
      "+"
    )} xxx&source=lnms&tbm=isch`;
  }
  javLibrarySearchLink(key) {
    return `http://www.javlibrary.com/en/vl_searchbyid.php?keyword=${key}`;
  }
  javLibraryAutoLink(items) {
    return `http://www.javlibrary.com/en/#find${items.join("/")}`;
  }
  javdoeSearchLink(items, href) {
    const address = [`https://javdoe.tv#${items.join("/")}`];
    if (href) address.push(href);
    return address.join("^");
  }
}
const WindowManagerService = new WindowManagerService$();

const windowChange = new Observer();

function useWindowManager() {
  const [windowLength, setWindowLength] = React.useState(0);

  const launch = async (video, i) => {
    await WindowManagerService.launch(video, i);
    setWindowLength((f) => f + 1);
    windowChange.next(true);
  };

  const exit = () => {
    WindowManagerService.exit();
    setWindowLength(0);
    windowChange.next(false);
  };

  const focus = () => {
    WindowManagerService.focus();
  };

  const getLength = () => WindowManagerService.launched.length;

  const visited = (video) => WindowManagerService.visited(video);

  return {
    getLength,
    launch,
    exit,
    focus,
    visited,
    windowLength,
  };
}

export { WindowManagerService, useWindowManager, windowChange };
