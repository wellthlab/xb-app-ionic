import { BoxProps, Box } from '@mui/joy';
import React from 'react';

interface IYoutubeVideoProps extends BoxProps {
    src: string;
}

const YouTubeVideo = function ({ src, ...others }: IYoutubeVideoProps) {
    return (
        <Box
            component="iframe"
            src={`https://youtube.com/embed/${src}`}
            title="YouTube video player"
            style={{ border: 0 }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            {...others}
        />
    );
};

export default YouTubeVideo;
