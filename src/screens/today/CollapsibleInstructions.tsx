import Strings from '../../utils/string_dict.js';
import { Link, Typography } from '@mui/joy';
import { Collapse } from '@mui/material';
import React from 'react';

interface ICollapsibleInstructionsProps {
    instructions: string[];
}

const CollapsibleInstructions = function ({ instructions }: ICollapsibleInstructionsProps) {
    const [open, setOpen] = React.useState(false);

    const handleToggle = function () {
        setOpen(!open);
    };

    const [first, ...rest] = instructions;

    return (
        <div>
            <Typography>{first}</Typography>

            {instructions.length > 1 && (
                <React.Fragment>
                    <Collapse in={open}>
                        {rest.map((instruction, i) => (
                            <Typography key={i} sx={{ mt: 2 }}>
                                {instruction}
                            </Typography>
                        ))}
                    </Collapse>
                    <Link onClick={handleToggle} sx={{ mt: 1 }}>
                        {Strings.read} {open ? Strings.less : Strings.more}
                    </Link>
                </React.Fragment>
            )}
        </div>
    );
};

export default CollapsibleInstructions;
