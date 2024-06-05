import Strings from '../../utils/string_dict';
import React from 'react';
import { BoxProps, Box } from '@mui/joy';

interface IYoutubeVideoProps extends BoxProps {
    src: string;
}

const YouTubeVideo = function ({ src, ...others }: IYoutubeVideoProps) {
    return (
        <Box
            component="iframe"
            src={`https://youtube.com/embed/${src}`}
            title={Strings.youtube_video_player}
            style={{ border: 0 }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            {...others}
        />
    );
};

export default YouTubeVideo;
