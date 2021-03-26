import React, {Component} from 'react';

import OverdueEntry from './OverdueEntry';
//import TeamUpdate from './LiveUpdate';
//import LiveUpdate from './LiveUpdate';


export default class ContentFeed extends Component {
    constructor(props) {
        super(props);
    }

    render(){
        const {feed} = this.props;

        return(
            <>
            {Object.keys(feed).map((key, i) => {

                var content;

                var item = feed[key];

                switch(item.type) {
                    /*case 'team_update':
                        content = <TeamUpdate item={item} />
                        break;
                    case 'live_update':
                        content = <LiveUpdate item={item} />
                        break;*/
                    case 'overdue_entry':
                        content = <OverdueEntry item={item} />
                        break;
                }

                return <ion-card key={item.id}>
                    {content}
                </ion-card>

            })}

            </>
        );
    }
}
