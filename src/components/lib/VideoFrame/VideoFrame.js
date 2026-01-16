import React from "react";
import { useParams } from "react-router-dom";
import { getVideo } from "../../../connector";

export default function VideoFrame() {
  const [file, setFile] = React.useState();
  const { id } = useParams();

  React.useEffect(() => {
    async function fetchVideo() {
      const { records } = await getVideo(id);
      if (!records?.length) return;
      setFile(records[0]);
    }
    fetchVideo();
  }, [id]);

  if (!file) {
    return <>Loading...</>;
  }

  return (
    <>
      <iframe
        style={{
          width: "100vw",
          height: "100vh",
        }}
        src={`${file.src}`}
        frameborder="0"
        border="0"
        scrolling="no"
        width="100%"
        height="100%"
      ></iframe>
    </>
  );
}
