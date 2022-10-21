import React from 'react';
import { IonPage, IonContent } from '@ionic/react';
import { Container } from '@mui/joy';

import Header from './Header';

export interface IPageProps {
    children: React.ReactNode;
    headerTitle?: string;
}

const Page = React.forwardRef(({ headerTitle, children }: IPageProps, ref) => {
    return (
        <IonPage ref={ref}>
            {headerTitle ? <Header title={headerTitle} /> : null}
            <IonContent>
                <Container>{children}</Container>
            </IonContent>
        </IonPage>
    );
});

export default Page;
