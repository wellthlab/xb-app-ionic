import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Typography, Card, CardOverflow, AspectRatio, Grid, Box, Stack, Link, linkClasses, CardContent } from '@mui/joy';
import capitalise from './utils/capitalise';
import { IBox } from '../../models/Experiment';

interface BoxCardProps {
    box: IBox;
}

const BoxCard: React.FC<BoxCardProps> = ({ box }) => {
    //console.log(box);

    const narrowImgSrc = box.heroImageSrc + '_narrow.svg';

    const cardImg = <img
        src={narrowImgSrc}
        loading="lazy"
        alt=""
    />;

    return (
        <Grid xs={6}>
            <Card
                component={RouterLink as React.ElementType}
                to={box.disabled ? undefined : `/main/box/${box.name}`}
                disabled={box.disabled}
                sx={{
                    textDecoration: 'none',
                    cursor: box.disabled ? 'default' : 'pointer',
                    filter: box.disabled ? 'grayscale(100%) brightness(0.9)' : 'none',
                    opacity: box.disabled ? 0.6 : 1,
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                        transform: 'scale(1.05)',
                        cursor: 'pointer',
                    },
                }}
            >
                <CardOverflow>
                    <AspectRatio ratio="900/500">
                        {cardImg}
                    </AspectRatio>
                </CardOverflow>
                <CardContent sx={{
                    pt: 2
                }}>
                    <Typography level="h2">{capitalise(box.name)}</Typography>
                    {box.overview && (
                        <Typography level="body2" sx={{ mt: 1 }}>
                            {box.overview}
                        </Typography>
                    )}

                </CardContent>
            </Card>
        </Grid>
    )
}

export default BoxCard;