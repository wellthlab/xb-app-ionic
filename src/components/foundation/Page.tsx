import React from 'react';
import { IonPage, IonContent, IonFooter, IonToolbar } from '@ionic/react';
import { Container, ContainerProps } from '@mui/joy';

import Header from './Header';

export interface IPageProps extends ContainerProps {
    children: React.ReactNode;
    headerTitle?: string;
    footerComponent?: JSX.Element
}

const Page = React.forwardRef(({ headerTitle, footerComponent, ...others }: IPageProps, ref) => {
    return (
        <IonPage
            ref={ref}
        >
            {headerTitle ? <Header title={headerTitle} /> : null}
            <IonContent>
                <Container
                    {...others}
                />
            </IonContent>
            {footerComponent ? <IonFooter>
                <IonToolbar>
                    {footerComponent}
                </IonToolbar>
            </IonFooter> : null}
        </IonPage>
    );
});

export default Page;
