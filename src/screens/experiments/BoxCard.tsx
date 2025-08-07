import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Typography, Card, CardOverflow, AspectRatio, Grid, Box, Stack, Link, linkClasses, CardContent } from '@mui/joy';
import capitalise from './utils/capitalise';
import { IBox } from '../../models/Experiment';

interface BoxCardProps {
    box: IBox;
}

const BoxCard: React.FC<BoxCardProps> = ({ box }) => {
    console.log(box);

    // TODO: cardImg should be stored in state, switch is brittle!
    let cardSrc = '';

    switch (capitalise(box.name)) {
        case "Move":
            cardSrc = '/assets/boxcard/move.svg';
            break;
        case "Eat":
            cardSrc = '/assets/boxcard/eat.svg';
            break;
        case "Sleep":
            cardSrc = '/assets/boxcard/sleep.svg';
            break;
        case "Journal":
            cardSrc = '/assets/boxcard/journal.svg';
            break;
        default:
            cardSrc = '/assets/boxcard/base.svg';
    }

    const cardImg = <img
        src={cardSrc}
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
                    <AspectRatio ratio="1">
                        {cardImg}
                    </AspectRatio>
                </CardOverflow>
                <CardContent sx={{
                    pt: 2
                }}>
                    <Typography level="h2" sx={{textAlign: "center"}}>{capitalise(box.name)}</Typography>
                </CardContent>
            </Card>
        </Grid>
    )
}

export default BoxCard;