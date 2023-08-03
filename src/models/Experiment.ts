import { BaseModel, ObjectId } from './utils';

export interface IBox {
    name: string;
    icon: string;
    disabled?: boolean;
}

interface IBoxDocument extends IBox {
    _id: ObjectId;
}

interface IBaseExperiment {
    id: string;
    name: string;
    box: string;
    desc?: string;
    duration: number;
    hidden?: boolean;
}

export interface IExperiment extends IBaseExperiment {
    instructions?: string[];
    duration: number;
    days: IDay[];
    parent?: string;
}

export interface IParentExperiment extends IBaseExperiment {
    continuation?: string;
    children: string[];
}

export type GenericExperiment = IExperiment | IParentExperiment;

interface IExperimentDocument extends Omit<IExperiment, 'id' | 'parent'> {
    _id: ObjectId;
    parent?: ObjectId;
}

interface IParentExperimentDocument extends Omit<IParentExperiment, 'id' | 'continuation' | 'children'> {
    _id: ObjectId;
    continuation?: ObjectId;
    children: ObjectId[];
}

type GenericExperimentDocument = IExperimentDocument | IParentExperimentDocument;

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
    | IStopwatch
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
    id: string;
    userId: string;
    experimentId: string | null;
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
    static async getExperiments(): Promise<GenericExperiment[]> {
        const db = this.getDb();

        const result = await db.collection<GenericExperimentDocument>('experiments').find();

        return result.map((item) => {
            if ('children' in item) {
                const { _id, children, continuation, ...others } = item;
                return {
                    ...others,
                    id: _id.toString(),
                    children: children.map((child) => child.toString()),
                    continuation: continuation?.toString(),
                };
            }

            const { _id, parent, ...others } = item;
            return {
                ...others,
                id: _id.toString(),
                parent: parent?.toString(),
            };
        });
    }

    static async getBoxes(): Promise<IBox[]> {
        const db = this.getDb();

        const result = await db.collection<IBoxDocument>('boxes').find();

        return result.map(({ _id, ...item }) => ({ ...item, id: _id.toString() }));
    }

    static saveResponse(response: Omit<IResponse, 'userId' | 'createdAt' | 'id'>) {
        const db = this.getDb();

        return db
            .collection<IResponseDocument>('responses')
            .insertOne({ ...response, userId: this.oid(this.client.currentUser!.id), createdAt: Date.now() });
    }

    static saveNote(note: string) {
        const db = this.getDb();

        const startDate = new Date();
        startDate.setUTCHours(0, 0, 0, 0);

        const endDate = new Date(startDate);
        endDate.setUTCHours(23, 59, 59, 9999);

        return db.collection<IResponseDocument>('responses').updateOne(
            {
                userId: this.oid(this.client.currentUser!.id),
                experimentId: null,
                dayId: 0,
                taskId: 0,
                createdAt: { $gte: startDate.getTime(), $lte: endDate.getTime() },
            },
            { $set: { payload: { note } }, $setOnInsert: { createdAt: Date.now() } },
            { upsert: true },
        );
    }

    static async getResponsesForDate(date: Date) {
        const startDate = new Date(date);
        startDate.setUTCHours(0, 0, 0, 0);

        const endDate = new Date(date);
        endDate.setUTCHours(23, 59, 59, 9999);

        const db = this.getDb();

        const result = await db.collection<IResponseDocument>('responses').find(
            {
                userId: this.oid(this.client.currentUser!.id),
                createdAt: { $gte: startDate.getTime(), $lte: endDate.getTime() },
            },
            { sort: { createdAt: -1 } },
        );

        return result.map((result: IResponseDocument) => {
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
