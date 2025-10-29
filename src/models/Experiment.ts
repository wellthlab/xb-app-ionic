export interface IBox {
    id: string;
    name: string;
    description?: any[];
    heroImageSrc?: string;
    icon: string;
    disabled?: boolean;
    color?: string;
    beginAtUserStartOfWeek?: boolean;
    overlayText?: string;
    overview: string;
}

interface IBaseExperiment {
    name: string;
    boxId: string;
    desc: any[];
    duration: number;
    hidden?: boolean;
    isSuggested: boolean;
    id: string;
}

export interface IExperiment extends IBaseExperiment {
    days: IDay[];
    steps: string[];
    tips: string[];
    preconditions?: any[];
    instructions?: string[];
    shouldSendReminders: boolean;
    // next_experiment_id?: string; // redundant - to be removed
    // also_experiment_id?: string; // redundant - to be removed
    prepExperiment: string;
    nextExperiment?: string;
    boxweek: number;
}

export interface IDay {
    id: string;
    tasks: ITask[];
    disabled?: boolean;
    desc?: string;
    preconditions?: any[];
    name: string;
}

export interface ITask {
    taskId: string;
    name: string;
    icon?: string;
    blocks: Block[];
    disabled?: boolean;
    preconditions?: any[];
    isRepeatable?: boolean;
    minOccurences?: number;
    type: string;
}

export type Block =
    | ITextInput
    | INumberInput
    | ISelectInput
    | ISliderInput
    | IHeartRateInput
    | ICheckbox
    | ITimeInput
    | IStopwatch
    | IPara
    | IVideo
    | IImage
    | ITitle
    | IGreenDetector
    | ICountdownTimer
    | IMovementRecorder
    | IMovementPicker
    | IDateInput
    | IMarkdown
    | IExpandable;

export interface IGenericInput {
    optional?: boolean;
    label: string;
    help?: string;
    rk: string;
}

interface IExpandable {
    type: 'expandable';
    title: string;
    contents: Block[];
}

interface IMedia {
    src: string;
}

interface IText {
    content: string;
}

interface ITextInput extends IGenericInput {
    type: 'text-input';
}

interface IMarkdown extends IText {
    type: 'markdown';
}

interface IDateInput extends IGenericInput {
    type: 'date-input';
}

interface ICheckbox extends IGenericInput {
    type: 'checkbox';
}

interface INumberInput extends IGenericInput {
    type: 'number-input';
}

interface ISelectInput extends IGenericInput {
    type: 'select-input';
    options: string[];
}

interface ISliderInput extends IGenericInput {
    type: 'slider-input';
    labels: [[number, string]];
    range: [number, number];
}

interface IHeartRateInput extends IGenericInput {
    type: 'heart-rate-input';
}

interface ITimeInput extends IGenericInput {
    type: 'time-input';
}

interface IStopwatch extends IGenericInput {
    type: 'stopwatch';
}

interface IGreenDetector extends Omit<IGenericInput, 'label' | 'help'> {
    type: 'green-detector';
}

interface IPara extends IText {
    type: 'para';
}

interface ITitle extends IText {
    type: 'title';
}

interface IVideo extends IMedia {
    type: 'video';
}

interface IImage extends IMedia {
    type: 'image';
    alt: string;
}

interface IMovementPicker extends IGenericInput {
    type: 'movement-picker';
    movements: IMovementConfig[];
}

interface IMovementRecorder {
    type: 'movement-recorder';
    movements: IMovementConfig[];
    max: number;
    countdown: Omit<ICountdownTimer, 'type'>;
}

export interface IMovementConfig {
    name: string;
    video?: string;
    desc?: string;
}

interface ICountdownTimer {
    type: 'countdown';
    duration: number;
    fixed?: boolean;
    notifications?: number[];
}

export interface IResponse {
    experimentId: string;
    taskId: string;
    dayNum: number;
    payload: Record<string, string | number>;
    createdAt: number;
}

class Experiment {
    static async getExperiments(lang: string): Promise<IExperiment[]> {
        const data = await fetch(`http://localhost:8082/experiments?locale=${lang}`);
        const experiments = await data.json();
        return experiments
            .filter((experiment: IExperiment) => experiment.days.length > 0)
            .map((experiment: any) => ({ ...experiment, id: experiment._id }));
    }

    static async getBoxes(lang: string): Promise<IBox[]> {
        const data = await fetch(`http://localhost:8082/boxes?locale=${lang}`);
        const boxes = await data.json();
        return boxes.map((box: any) => ({ ...box, id: box._id }));
    }

    static saveResponse(response: Omit<IResponse, 'createdAt'>): IResponse[] {
        const existingResponses = this.getResponses();
        const existingIndex = existingResponses.findIndex(
            (r) =>
                r.experimentId === response.experimentId &&
                r.taskId === response.taskId &&
                r.dayNum === response.dayNum,
        );
        if (existingIndex !== -1) {
            existingResponses[existingIndex] = { ...response, createdAt: Date.now() };
        } else {
            existingResponses.push({
                ...response,
                createdAt: Date.now(),
            });
        }

        window.localStorage.setItem('responses', JSON.stringify(existingResponses));
        return existingResponses;
    }

    static getResponses(): IResponse[] {
        const responses = window.localStorage.getItem('responses');
        return responses ? JSON.parse(responses) : [];
    }

    static getResponse(experimentId: string, taskId: string, dayNum: number): IResponse | null {
        const responses = this.getResponses();
        return (
            responses.find((r) => r.experimentId === experimentId && r.taskId === taskId && r.dayNum === dayNum) || null
        );
    }
}

export default Experiment;
