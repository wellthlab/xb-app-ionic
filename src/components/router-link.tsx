import React from 'react';
import { useIonRouter } from '@ionic/react';
import { Link, LinkProps } from '@mui/joy';
import { CaretLeft } from '@phosphor-icons/react';

export type RouterLinkProps = LinkProps & {
    href: string;
    direction?: 'forward' | 'backward';
    backIcon?: React.ReactNode;
    replace?: boolean;
};

export const RouterLink = React.forwardRef<HTMLAnchorElement, RouterLinkProps>(function RouterLink(
    { href, direction = 'forward', onClick: externalOnClick, children, backIcon, replace, ...others },
    ref,
) {
    const router = useIonRouter();

    function onClick(e: React.MouseEvent<HTMLAnchorElement>) {
        e.preventDefault();
        externalOnClick?.(e);

        if (direction === 'forward') {
            router.push(href, 'forward', replace ? 'replace' : 'push');
            return;
        }

        if (router.canGoBack()) {
            router.goBack();
            return;
        }

        router.push(href, 'back', 'replace');
    }

    return (
        <Link
            ref={ref}
            href={href}
            startDecorator={direction === 'backward' && (backIcon === true ? <CaretLeft /> : backIcon)}
            onClick={onClick}
            {...others}
        >
            {children}
        </Link>
    );
});
