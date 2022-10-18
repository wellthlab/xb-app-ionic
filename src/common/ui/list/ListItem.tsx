import React from 'react';
import { Link } from 'react-router-dom';
import {
    ListItem as JoyListItem,
    ListItemButton,
    ListItemButtonProps,
    ListItemDecorator,
    ListItemProps,
    ListItemContent,
} from '@mui/joy';

export interface IListItemProps extends Omit<ListItemProps, 'onClick'> {
    href?: string;
    button?: boolean;
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
    buttonProps?: Omit<ListItemButtonProps, 'onClick'>;
    startDecorator?: React.ReactNode;
    endDecorator?: React.ReactNode;
    children: React.ReactNode;
}

const ListItem = function ({
    href,
    button,
    onClick,
    buttonProps,
    children,
    startDecorator,
    endDecorator,
    ...others
}: IListItemProps) {
    const inner = (
        <React.Fragment>
            {startDecorator ? <ListItemDecorator>{startDecorator}</ListItemDecorator> : null}
            <ListItemContent>{children}</ListItemContent>
            {endDecorator ? <ListItemDecorator>{endDecorator}</ListItemDecorator> : null}
        </React.Fragment>
    );

    let child = inner;

    const actualButtonProps = { onClick, ...buttonProps };

    if (button) {
        child = <ListItemButton {...actualButtonProps}>{inner}</ListItemButton>;
    } else if (href) {
        child = (
            <ListItemButton component={Link} to={href} {...actualButtonProps}>
                {inner}
            </ListItemButton>
        );
    }

    return <JoyListItem {...others}>{child}</JoyListItem>;
};

export default ListItem;
