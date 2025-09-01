import Strings from '../../utils/string_dict';
import React from 'react';
import { BoxProps, Box } from '@mui/joy';

interface IYoutubeVideoProps extends BoxProps {
    src: string;
}

const YouTubeVideo = function ({ src, ...others }: IYoutubeVideoProps) {
    src = src.startsWith('https') ? src : `https://youtube.com/embed/${src}`;
    return (
        <Box
            component="iframe"
            src={src}
            title={Strings.youtube_video_player}
            style={{ width: '100%', height: 300, flexGrow: 1 }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            {...others}
        />
    );
};

export default YouTubeVideo;
