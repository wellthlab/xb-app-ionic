import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IonContent, IonButton, IonItem, IonInput, IonCard } from '@ionic/react';

import './Login.scss';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <IonContent>
            <div id="login">
                <img src="/assets/strength_logo.png" alt="XB Logo" />
                <IonCard>
                    <IonItem>
                        <IonInput placeholder="Email" type="email" />
                    </IonItem>
                    <IonItem>
                        <IonInput placeholder="Password" type="password" autocomplete="on" />
                    </IonItem>
                </IonCard>
                <div className="centering">
                    <IonButton slot="end">Log In</IonButton>
                </div>
                <div>
                    <div className="centering">
                        <Link to="/forgot-password">Forgotten password?</Link>
                    </div>
                    <h4>New to the app?</h4>
                    <div className="centering">
                        <IonButton routerLink="/register">Register</IonButton>
                    </div>
                </div>
            </div>
        </IonContent>
    );
};

export default LoginForm;
