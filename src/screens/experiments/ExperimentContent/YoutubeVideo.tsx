import React from 'react';

interface IYoutubeVideoProps {
    src: string;
}

const YouTubeVideo = function ({ src }: IYoutubeVideoProps) {
    return (
        <iframe
            src={src}
            title="YouTube video player"
            style={{ border: 0 }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
        />
    );
};

export default YouTubeVideo;
