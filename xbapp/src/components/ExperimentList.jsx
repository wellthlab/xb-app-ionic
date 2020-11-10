import React, {Component} from 'react';

export default class ExperimentList extends Component{
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
