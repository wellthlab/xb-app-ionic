import React from "react";

const Video = ({ src }) => {
  return (
    <div>
      <iframe
        title="playlist-videoplayer"
        frameBorder="0"
        scrolling="no"
        marginHeight="0"
        marginWidth="0"
        style={{ width: "100%", height: "300px" }}
        type="text/html"
        src={`https://www.youtube-nocookie.com/embed/${src.trim()}?autoplay=0&fs=0&iv_load_policy=3&showinfo=0&rel=0&cc_load_policy=0&start=0&end=0`}
      />
    </div>
  );
};

export default Video;
