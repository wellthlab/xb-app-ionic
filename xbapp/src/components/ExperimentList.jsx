import React, {Component} from 'react';

class ExperimentList extends Component {
  constructor(props) {
    super(props);
  }

  render(){
    const {experiments: exps} = this.props;

    return(
        <div>
          {exps.map((exp, i) => {
            return <ion-card key={i}>
                  <ion-card-header>
                      <ion-card-title>{exp.title}</ion-card-title>
                  </ion-card-header>

                  <ion-card-content>
                      <ion-img src={exp.img}/>
                  </ion-card-content>
              </ion-card>
            })}
        </div>
    );
  }
}

/**
 * Show information about the current experiment
 */
class ExperimentCard extends Component {
    constructor(props) {
      super(props);
    }

    render(){
      const exp = this.props.experiment;

      return(
          <div>
            {exps.map((exp, i) => {
              return <ion-card key={i}>
                    <ion-card-header>
                        <ion-card-title>{exp.title}</ion-card-title>
                    </ion-card-header>

                    <ion-card-content>
                        <ion-img src={exp.img}/>
                    </ion-card-content>
                </ion-card>
              })}
          </div>
      );
    }
}
