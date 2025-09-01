import Strings from '../../utils/string_dict';
import React from 'react';
import { Typography, Grid } from '@mui/joy';
import Page from '../../components/foundation/Page';
import { useSelector } from '../../slices/store';
import { selectAllBoxes } from '../../slices/experiments';
import BoxCard from './BoxCard';

const BoxesList = function () {
    const boxes = useSelector(selectAllBoxes);

    // Sort disabled boxes to end of grid
    const sortedBoxes = [...boxes].sort((a, b) => {
        return a.disabled === b.disabled ? 0 : a.disabled ? 1 : -1;
    });

    return (
        <Page
            sx={{
                backgroundColor: 'var(--joy-palette-neutral-50)',
            }}
        >
            <Typography level="h1" sx={{ mb: 2 }}>
                {Strings.boxes}
            </Typography>

            <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                {sortedBoxes.map((box) => {
                    return <BoxCard key={box.id} box={box} />;
                })}
            </Grid>
        </Page>
    );
};

export default BoxesList;
