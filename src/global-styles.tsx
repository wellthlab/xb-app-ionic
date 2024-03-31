import { GlobalStyles as JoyGlobalStyles } from '@mui/joy';

export function GlobalStyles() {
    return (
        <JoyGlobalStyles
            styles={(theme) => ({
                ':root': {
                    '--ion-background-color': theme.vars.palette.background.body,

                    '--ion-tab-bar-background': theme.vars.palette.background.surface,
                    '--ion-tab-bar-border-color': theme.vars.palette.divider,
                    '--ion-tab-bar-color': theme.vars.palette.neutral.plainColor,
                    '--ion-tab-bar-color-selected': theme.vars.palette.primary.plainColor,
                },

                '#root': {
                    maxWidth: theme.breakpoints.values.sm,
                    margin: 'auto',
                    position: 'relative',
                    height: '100dvh',
                    width: '100dvw',
                    overflow: 'hidden',
                },

                'ion-content': {
                    '--padding-start': theme.spacing(2),
                    '--padding-end': theme.spacing(2),
                    '--padding-top': theme.spacing(4),
                    '--padding-bottom': theme.spacing(2),

                    '::part(scroll)': {
                        display: 'flex',
                        flexDirection: 'column',
                    },
                },
            })}
        />
    );
}
