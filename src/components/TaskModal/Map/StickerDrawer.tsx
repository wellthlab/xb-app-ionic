import React from 'react';
import Sticker, { findFolder } from './sticker';
import { Paper } from '@mui/material';
import { Grid } from '@mui/material';

type StickerDrawerProps = {
    stickers: Sticker[];
    activeSticker: Sticker;
    onStickerClick: (index: Sticker) => void;
};

function StickerDrawer(props: StickerDrawerProps) {
    return (
        <Paper style={{ maxHeight: 150, overflowY: 'auto', overflowX: 'hidden' }}>
            <Grid container>
                {props.stickers.map((sticker) => {
                    return (
                        <Grid item key={sticker} xs={3}>
                            <button
                                onClick={() => props.onStickerClick(sticker)}
                                key={sticker}
                                style={{ backgroundColor: 'white' }}
                            >
                                <img
                                    src={findFolder(sticker)}
                                    alt={sticker}
                                    width={32}
                                    height={32}
                                    style={{ backgroundColor: 'white' }}
                                />
                            </button>
                            <p style={{ padding: 0, margin: 0 }}>{sticker}</p>
                        </Grid>
                    );
                })}
            </Grid>
        </Paper>
    );
}

export default StickerDrawer;
