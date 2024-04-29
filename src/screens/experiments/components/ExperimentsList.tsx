import React, { CSSProperties, Fragment } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import {
    Stack,
    Card,
    Typography,
    Link,
    LinearProgress,
    Checkbox, Tabs, TabList, Tab, TabPanel, TabsProps,
} from '@mui/joy';

import { GenericExperiment } from '../../../models/Experiment';
import { useSelector } from '../../../slices/store';
import { selectCompletionForAllExperiments } from '../../../slices/experiments';

interface IExperimentsListProps {
    experiments: GenericExperiment[];
    onExperimentSelected?: (experiment: GenericExperiment, isSelected: boolean) => void;
}

const ExperimentsList = function({ experiments, onExperimentSelected }: IExperimentsListProps) {
    const experiments_  = JSON.parse(JSON.stringify(experiments)) as GenericExperiment[];
    let boxWeeks = experiments_.map((e: { boxWeek: number; }) => {
        if (!e.boxWeek) {
            e.boxWeek = 0;
        }
        return e.boxWeek;
    });
    // @ts-ignore
    boxWeeks = [...new Set(boxWeeks)];
    const completionByExperimentId = useSelector(selectCompletionForAllExperiments);
    const [tabIndex, setTabIndex] = React.useState(0);

    const handleTabChange: TabsProps['onChange'] = function (_, value) {
        setTabIndex(value as number);
    };


    const checkBoxStyle: CSSProperties = {
        position: "absolute",
        right: 0,
        padding: "0.5rem",
        top: 0,
        fontSize: "1.5rem",
    };

    const elems = boxWeeks.map((boxWeek) => {
        const boxWeekExperiments = experiments_.filter(e => !e.hidden && e.boxWeek === boxWeek);
        return <Stack spacing={2}
        >
            {boxWeekExperiments
                .map((experiment) => {
                    const completion = completionByExperimentId[experiment.id];
                    return (
                        <Card
                            key={experiment.id}
                            variant="outlined"
                            sx={{
                                '&:hover, &:focus-within': { bgcolor: 'background.level2' },
                            }}
                        >
                            <div>
                                {experiment.name}
                                {onExperimentSelected && <span style={checkBoxStyle}> <Checkbox variant="outlined"  size="sm" onChange={(event)  => onExperimentSelected(experiment, event.target.checked)}/> </span>}
                            </div>

                            <Stack spacing={1}>
                                <Link
                                    overlay
                                    textColor="inherit"
                                    underline="none"
                                    onClick={() => {history.push(`${pathname}/${experiment.id}`);}}
                                >
                                </Link>
                                {experiment.desc && <Typography level="body2">{experiment.desc}</Typography>}
                                {completion !== undefined ? (
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Typography level="body3">{completion}% completed</Typography>
                                        <LinearProgress determinate value={completion} />
                                    </Stack>
                                ) : (
                                    <Typography level="body3">{experiment.duration} day(s)</Typography>
                                )}
                            </Stack>

                        </Card>
                    );
                })}
        </Stack>;

    });

    const { pathname } = useLocation();
    const history = useHistory();

    return (
        <Tabs aria-label="week tabs" value={tabIndex} onChange={handleTabChange} sx={{ bgcolor: 'transparent', height: "100" }}>
            {onExperimentSelected && <TabList>
                {boxWeeks.sort().map((boxWeek) => {
                    return <Tab variant={tabIndex === boxWeek  ? 'solid' : 'plain'} color={tabIndex === boxWeek ? 'primary' : 'neutral'} > Week {boxWeek + 1} </Tab>
                })}
            </TabList>}
            <br/>
            {boxWeeks.sort().map((boxWeek) => {
                return <TabPanel value={boxWeek}> {elems[boxWeek]} </TabPanel>
            })}
        </Tabs>
    );
};

export default ExperimentsList;
