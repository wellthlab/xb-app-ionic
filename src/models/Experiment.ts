import { BaseModel, ObjectId } from './utils';

export interface IExperiment {
    id: string;
    name: string;
    box: string;
    icon: string;
    desc: string;
    longDesc?: string[];
    duration: number;
    days: IDay[];
}

export interface IExperimentDocument extends Omit<IExperiment, 'id'> {
    _id: ObjectId;
}

export interface IDay {
    name: string;
    desc?: string;
    tasks: ITask[];
}

export interface ITask {
    name: string;
    icon?: string;
    blocks: Block[];
}

export type Block =
    | ITextInput
    | INumberInput
    | ISelectInput
    | ISliderInput
    | IHeartRateInput
    | ICheckbox
    | ITimeInput
    | IPara
    | IVideo
    | IImage
    | ITitle
    | IGreenDetector
    | ICountdownTimer
    | IMovementRecorder
    | IMovementPicker;

export interface IGenericInput {
    optional?: boolean;
    label: string;
    help?: string;
    rk: string;
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
    labels: Record<string, string>;
    range: [number, number];
}

interface IHeartRateInput extends IGenericInput {
    type: 'heart-rate-input';
}

interface ITimeInput extends IGenericInput {
    type: 'time-input';
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
    movements: [string, string][];
}

interface IMovementRecorder {
    type: 'movement-recorder';
    movements: [string, string][];
    max: number;
    countdown: Omit<ICountdownTimer, 'type'>;
}

interface ICountdownTimer {
    type: 'countdown';
    duration: number;
    fixed?: boolean;
}

export interface IResponse {
    id: string;
    userId: string;
    experimentId: string;
    dayId: number;
    taskId: number;
    payload: Record<string, string | number>;
    createdAt: number;
}

interface IResponseDocument extends Omit<IResponse, 'userId' | 'id'> {
    _id: ObjectId;
    userId: ObjectId;
}

class Experiment extends BaseModel {
    static async getExperiments() {
        const db = this.getDb();

        const result = await db.collection<IExperimentDocument>('experiments').find();

        return result.map((item) => {
            const { _id, ...others } = item;
            return { id: _id.toString(), ...others };
        });
    }

    static saveResponse(response: Omit<IResponse, 'userId' | 'createdAt' | 'id'>) {
        const db = this.getDb();

        return db
            .collection<IResponseDocument>('responses')
            .insertOne({ ...response, userId: this.oid(this.client.currentUser!.id), createdAt: Date.now() });
    }

    static async getResponsesForDate(date: Date) {
        const startDate = new Date(date);
        startDate.setUTCHours(0, 0, 0, 0);
        const startTs = startDate.getTime();

        const endDate = new Date(date);
        endDate.setUTCHours(23, 59, 59, 9999);
        const endTs = endDate.getTime();

        const db = this.getDb();

        const result = await db
            .collection<IResponseDocument>('responses')
            .find(
                { userId: this.oid(this.client.currentUser!.id), createdAt: { $gte: startTs, $lte: endTs } },
                { sort: { createdAt: -1 } },
            );

        return result.map((result) => {
            const { _id, userId, ...others } = result;

            return {
                id: _id.toString(),
                userId: userId.toString(),
                ...others,
            };
        });
    }
}

export default Experiment;
