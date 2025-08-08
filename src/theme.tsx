import React from 'react';
import { deepmerge } from '@mui/utils';
import colors from '@mui/joy/colors';
import {
    experimental_extendTheme as extendMuiTheme,
    shouldSkipGeneratingVar as muiShouldSkipGeneratingVar,
} from '@mui/material/styles';
import {
    extendTheme as extendJoyTheme,
    Theme as JoyTheme,
    useColorScheme,
    CssVarsProvider,
    shouldSkipGeneratingVar as joyShouldSkipGeneratingVar,
} from '@mui/joy/styles';

import type { } from '@mui/x-date-pickers/themeAugmentation';
import type { } from '@mui/lab/themeAugmentation';

const { unstable_sxConfig: muiSxConfig, ...muiTheme } = extendMuiTheme({
    // This is required to point to `var(--joy-*)` because we are using
    // `CssVarsProvider` from Joy UI.
    cssVarPrefix: 'joy',

    typography: {
        fontFamily: '"Barlow", "Arial", sans-serif',
    },

    colorSchemes: {
        light: {
            palette: {
                primary: {
                    main: colors.blue[500],
                },
                grey: colors.grey,
                error: {
                    main: colors.red[500],
                },
                info: {
                    main: colors.purple[500],
                },
                success: {
                    main: colors.green[500],
                },
                warning: {
                    main: colors.yellow[200],
                },
                common: {
                    white: '#FFF',
                    black: '#09090D',
                },
                divider: colors.grey[200],
                text: {
                    primary: 'rgb(32, 38, 46)',
                    secondary: 'rgb(163,184,194)',
                },
            },
        },
        dark: {
            palette: {
                primary: {
                    main: colors.blue[600],
                },
                grey: colors.grey,
                error: {
                    main: colors.red[600],
                },
                info: {
                    main: colors.purple[600],
                },
                success: {
                    main: colors.green[600],
                },
                warning: {
                    main: colors.yellow[300],
                },
                common: {
                    white: '#FFF',
                    black: '#09090D',
                },
                divider: colors.grey[800],
                text: {
                    primary: colors.grey[100],
                    secondary: colors.grey[300],
                },
            },
        },
    },

    components: {
        MuiButtonBase: {
            defaultProps: {
                disableRipple: true,
            },
        },

        MuiPickersDay: {
            styleOverrides: {
                root: ({ theme }) => ({
                    fontFamily: ((theme as unknown) as JoyTheme).fontFamily.body,
                    lineHeight: 1,
                }),
            },
        },
    },
});

const { unstable_sxConfig: joySxConfig, ...joyTheme } = extendJoyTheme({
    fontFamily: {
        display: '"Barlow", "Arial", sans-serif',
        body: '"Barlow", "Arial", sans-serif',
        code: 'monospace',
    },
    fontWeight: {
        sm: 300,  // Small / light
        md: 400,  // Medium / normal
        lg: 500,  // Large / semi-bold
        xl: 700,  // Extra bold (optional)
    },
    fontSize: {
        xs: '0.79rem',
        sm: '0.889rem',
        md: '1rem',
        lg: '1.266rem',
        xl: '1.424rem',
        xl2: '1.602rem',
        xl3: '1.802rem',
        xl4: '2.027rem',
    },
    lineHeight: {
        sm: '1.15',
        md: '1.6',
        lg: '1.75',
    },
    letterSpacing: {
        sm: '0em',
        md: '0.01em',
        lg: '0.05em',
    },
    components: {
        JoyList: {
            defaultProps: { variant: 'soft' },
            styleOverrides: {
                root: ({ theme }) => ({
                    borderRadius: theme.vars.radius.sm,
                    flex: 0,
                }),
            },
        },

        JoyCard: {
            defaultProps: { variant: 'outlined' },
        },

        JoyContainer: {
            styleOverrides: {
                root: ({ theme }) => ({
                    minHeight: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: theme.spacing(4, 2),
                }),
            },
        },
    },
});

// You can use your own `deepmerge` function.
// joyTheme will deeply merge to muiTheme.
const mergedTheme = (deepmerge(muiTheme, joyTheme) as unknown) as ReturnType<typeof extendJoyTheme>;

mergedTheme.unstable_sxConfig = {
    ...muiSxConfig,
    ...joySxConfig,
};

export const ThemeProvider = function ({ children }: React.PropsWithChildren) {
    return (
        <CssVarsProvider
            theme={mergedTheme}
            shouldSkipGeneratingVar={(keys) => muiShouldSkipGeneratingVar(keys) || joyShouldSkipGeneratingVar(keys)}
            defaultMode="system"
        >
            {children}
        </CssVarsProvider>
    );
};

export const ColorModeController = function () {
    const { systemMode, mode } = useColorScheme();

    React.useEffect(() => {
        const toggleBodyClassName = function (suppliedMode: string | undefined) {
            if (suppliedMode === 'dark') {
                document.body.classList.add('dark');
            } else {
                document.body.classList.remove('dark');
            }
        };

        if (mode !== 'system') {
            return toggleBodyClassName(mode);
        }

        toggleBodyClassName(systemMode);
    }, [systemMode, mode]);

    return null;
};
