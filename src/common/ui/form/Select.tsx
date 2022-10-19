import React from 'react';
import { Box, FormHelperText, FormLabel } from '@mui/joy';
import FormControl from '@mui/joy/FormControl';
import { CaretDown } from 'phosphor-react';

export interface ISelectProps {
    label?: string;
    helperText?: string;
    error?: boolean;
    options: readonly string[];
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onFocus?: () => void;
    onBlur?: () => void;
}

const Select = function ({ label, helperText, error, options, value, onChange, onFocus, onBlur }: ISelectProps) {
    const color = error ? 'danger' : 'neutral';

    return (
        <FormControl error={error}>
            {label ? <FormLabel>{label}</FormLabel> : null}

            <Box
                sx={{
                    fontFamily: 'body',
                    bgcolor: 'background.surface',
                    color: `${color}.outlinedColor`,
                    border: '1px solid',
                    borderColor: `${color}.outlinedBorder`,
                    borderRadius: 'sm',
                    display: 'flex',
                    alignItems: 'center',
                    height: '2.5rem',
                    paddingInline: '0.75rem',

                    ':focus-within': {
                        borderColor: 'focusVisible',
                        borderWidth: (theme) => theme.vars.focus.thickness,
                    },
                }}
            >
                <Box
                    component="select"
                    sx={{
                        border: 'none',
                        bgcolor: 'transparent',
                        flex: 1,
                        minWidth: 0,
                        appearance: 'none',

                        ':focus': {
                            outline: 0,
                        },

                        '& option': { bgcolor: 'background.surface' },
                    }}
                    value={value}
                    onChange={onChange}
                    onFocus={onFocus}
                    onBlur={onBlur}
                >
                    <option value="" disabled hidden>
                        Please select
                    </option>
                    {options.map((option) => (
                        <option value={option} key={option}>
                            {option}
                        </option>
                    ))}
                </Box>

                <Box component={CaretDown} sx={{ color: `${color}.outlinedColor` }} />
            </Box>

            {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
    );
};

export default Select;
