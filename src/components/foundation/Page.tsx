import React from 'react';
import { IonPage, IonContent } from '@ionic/react';
import { Container, ContainerProps } from '@mui/joy';

import Header from './Header';

export interface IPageProps extends ContainerProps {
    children: React.ReactNode;
    headerTitle?: string;
}

const Page = React.forwardRef(({ headerTitle, ...others }: IPageProps, ref) => {
    return (
        <IonPage ref={ref}>
            {headerTitle ? <Header title={headerTitle} /> : null}
            <IonContent>
                <Container {...others} />
            </IonContent>
        </IonPage>
    );
});

export default Page;
