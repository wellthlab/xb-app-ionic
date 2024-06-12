import React from 'react';
import { ArrowRight, CaretRight, Repeat } from 'phosphor-react';
import { useHistory } from 'react-router-dom';

import { IExperiment } from '../../../models/Experiment';

import { useSelector } from '../../../slices/store';
import { selectExperimentById } from '../../../slices/experiments';
import List from '../../../components/foundation/List';
import ListItem from '../../../components/foundation/ListItem';
import Strings from '../../../utils/string_dict';

interface SuggestExperimentsListProps {
    experiment: IExperiment;
    experimentCompleted: boolean;
    resubOnClick: any;
}

const SuggestionsList = function ({experiment, experimentCompleted, resubOnClick}: SuggestExperimentsListProps) {

    const history = useHistory();

    const nextExperiment = useSelector((state) => experiment.next_experiment_id
        ?  selectExperimentById(state, experiment.next_experiment_id!) as IExperiment
        :  null
    );

    const alsoExperiment = useSelector((state) => experiment.also_experiment_id
        ?  selectExperimentById(state, experiment.also_experiment_id!) as IExperiment
        :  null
    );

    const getResubBox = () => {
        return <ListItem
            key={`suggestion_resubscribe`}
            startDecorator={<Repeat/>}
            endDecorator={experimentCompleted && <CaretRight />}
            onClick={resubOnClick}
            button={experimentCompleted}
        >
            {Strings.repeat_experiment}
        </ListItem>
    };

    const getSubNewExperimentListItem = (itemExperiment : IExperiment, leadText : string, decorator : React.ReactNode) => {
        return <ListItem
            key={`suggestion_${leadText}`}
            startDecorator={decorator}
            endDecorator={experimentCompleted && <CaretRight />}
            onClick={() => {history.push(`/main/box/${itemExperiment.boxId}/${itemExperiment.id}`);}}
            button={experimentCompleted}
        >
            {leadText} &mdash; {itemExperiment.name}
        </ListItem>
    };

    var suggestedItems = [getResubBox()];
    if (nextExperiment) {
        suggestedItems.push(getSubNewExperimentListItem(nextExperiment!, Strings.next_experiment, <ArrowRight/>))
    };
    if (alsoExperiment) {
        suggestedItems.push(getSubNewExperimentListItem(alsoExperiment!, Strings.see_also, <ArrowRight/>))
    };

    return <List sx={{ mb: 2 }}>
        {suggestedItems}
    </List>
};

export default SuggestionsList;
