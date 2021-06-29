import './App.css';
import { useEffect, useState, Component } from 'react';
import { Switch, Route, Router, BrowserRouter, Link } from 'react-router-dom';
import ResetPasswordPage from './pages/ResetPassword';
import Unknown from './components/unknown';
import '@ionic/react/css/core.css';
import { IonApp } from '@ionic/react'

import "@ionic/react/css/core.css";
/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";
/* Theme variables */
import "./theme/variables.css";

import "./theme/App.css";
function App() {
  const [apiResponse, setApiResponse] = useState("");

  function callApi() {
    fetch("http://localhost:9000/reset")
      .then(res => res.text())
      .then(res => setApiResponse(res));
  }

  useEffect(() => {
  }, [])

  return (
    <div className="App">
      <div className="component">
        <IonApp>
          <BrowserRouter>
            <Switch>
              <Route exact path={"/"}
                render={(props) => (
                  <ResetPasswordPage {...props}></ResetPasswordPage>
                )} />
              <Route component={Unknown} />
            </Switch>
          </BrowserRouter>
        </IonApp>

      </div>
    </div>
  );
}

export default App;
