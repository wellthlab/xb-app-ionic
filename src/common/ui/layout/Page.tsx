import React from 'react';
import { IonPage, IonContent } from '@ionic/react';
import { Container, ContainerProps } from '@mui/joy';

import Header from './Header';

export interface IPageProps extends ContainerProps {
    headerTitle?: string;
}

const Page = React.forwardRef(({ sx, headerTitle, ...others }: IPageProps, ref) => {
    return (
        <IonPage ref={ref}>
            {headerTitle ? <Header title={headerTitle} /> : null}
            <IonContent>
                <Container
                    sx={{ py: 4, minHeight: '100%', display: 'flex', flexDirection: 'column', ...sx }}
                    {...others}
                />
            </IonContent>
        </IonPage>
    );
});

export default Page;
