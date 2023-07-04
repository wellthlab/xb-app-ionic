import React from 'react';
import { List as JoyList, ListDivider, ListProps } from '@mui/joy';

export interface IListProps extends ListProps {
    noDividers?: boolean;
}

const List = function ({ children, noDividers, ...others }: IListProps) {
    const childrenCount = React.Children.count(children);

    if (noDividers) {
        return <JoyList children={children} {...others} />;
    }

    return (
        <JoyList {...others}>
            {React.Children.map(children, (child, i) => {
                if (i === childrenCount - 1) {
                    return child;
                }

                return (
                    <React.Fragment>
                        {child}
                        <ListDivider />
                    </React.Fragment>
                );
            })}
        </JoyList>
    );
};

export default List;
