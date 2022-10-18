import React from 'react';
import { IonPage, IonContent } from '@ionic/react';
import { Container, ContainerProps } from '@mui/joy';

export interface IPageProps extends ContainerProps {}

const Page = React.forwardRef(({ sx, ...others }: IPageProps, ref) => {
    return (
        <IonPage ref={ref}>
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
