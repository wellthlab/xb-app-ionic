import { BaseModel, ObjectId } from './utils';
import { convertObjectIdFieldsToString } from '../utils/helperFunctions';
import { Record } from 'phosphor-react';

export interface IBox {
    id: string;
    name: string;
    description: string;
    icon: string;
    disabled?: boolean;
}

interface IBoxDocument extends IBox {
    _id: ObjectId;
}

interface IBaseExperiment {
    name: string;
    boxId: string;
    desc?: string;
    duration: number;
    hidden?: boolean;
    isSuggested: boolean
    id: string;
}

export enum ExperimentCategory {
    ACTIVE = "ACTIVE",
    SUGGESTED = "SUGGESTED",
    AVAILABLE = "AVAILABLE",
    COMPLETED = "COMPLETED",
    SUB_EXPERIMENT = "SUB_EXPERIMENT",
    SCHEDULED = "SCHEDULED"
}

export interface IExperimentSchedule {
    startTimeUTC: number,
    experiments: string[],
}

export interface IExperiment extends IBaseExperiment {
    days: IDay[];
    preconditions?: any[];
    parent?: string;
    instructions?: string[];
    shouldSendReminders: boolean;
    next_experiment_id?: string;
    also_experiment_id?: string;
}

export interface IParentExperiment extends IBaseExperiment {
    children: string[];
}

export type GenericExperiment = IExperiment | IParentExperiment;

interface IExperimentDocument extends Omit<IExperiment, 'id' | 'parent'> {
    _id: ObjectId;
    parent?: ObjectId;
}

interface IParentExperimentDocument extends Omit<IParentExperiment, 'id' | 'children'> {
    _id: ObjectId;
    children: ObjectId[];
}

type GenericExperimentDocument = IExperimentDocument | IParentExperimentDocument;

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
    subscriptionId: string;
    taskId: string;
    dayNum: number;
    payload: Record<string, string | number>;
    createdAt: number;
    inactiveSubscription?: boolean;
}

interface IResponseDocument extends Omit<IResponse, 'id' | 'subscriptionId' | 'taskId' > {
    _id: ObjectId;
    subscriptionId: ObjectId;
    taskId: ObjectId;
}

class Experiment extends BaseModel {
    static async getExperiments(): Promise<GenericExperiment[]> {
        const db = this.getDb();
        const records = await db.collection<GenericExperimentDocument>('experiments').find();
        records.forEach(record => convertObjectIdFieldsToString(record));

        return records.map(record => {
             const asGenericExperiment= record as unknown as GenericExperiment;
             asGenericExperiment.id = record._id as unknown as string;
             return asGenericExperiment;
        });
    }

    static async getBoxes(): Promise<IBox[]> {
        const db = this.getDb();

        const result = await db.collection<IBoxDocument>('boxes').find();

        return result.map(({ _id, ...item }) => ({ ...item, id: _id.toString() }));
    }

    static saveResponse(response: Omit<IResponse, 'subscriptionId' |'createdAt' | 'id'>, subscriptionId: string) {
        const db = this.getDb();

        return db
            .collection<IResponseDocument>('responses')
            .insertOne({ ...response, taskId: this.oid(response.taskId), subscriptionId: this.oid(subscriptionId), createdAt: Date.now() });
    }

    static async getResponses(subscriptionIds: string[]) {
        const db = this.getDb();
        const subscriptionIdsAsObjectIds = subscriptionIds.map(subscriptionId => this.oid(subscriptionId));
        const responses = await db.collection<IResponseDocument>('responses')
            .find({ subscriptionId: { $in: subscriptionIdsAsObjectIds } });
        convertObjectIdFieldsToString(responses);

        const responsesAsIResponse =  responses.map(record => {
            const asIResponse= record as unknown as IResponse;
            asIResponse.id = record._id as unknown as string;
            return asIResponse;
        });

        const responsesGroupedBySubscriptionId = responsesAsIResponse.reduce((records: Record<string, IResponse[]>, response) => {
            if (records[response.subscriptionId]) {
                records[response.subscriptionId].push(response);
            } else {
                records[response.subscriptionId] = [response];
            }
            return records;
        }, {});

        return responsesGroupedBySubscriptionId;
    }


    static deleteResponses(subscriptionIds: string []) {
        const db = this.getDb();
        const subscriptionIdsAsObjectId = subscriptionIds.map(s => this.oid(s));

        return db
            .collection('responses')
            .deleteMany({ subscriptionId: { $in : subscriptionIdsAsObjectId } });
    }

    
    static flagResponsesInactive(subscriptionIds: string []) {
        const db = this.getDb();
        const subscriptionIdsAsObjectId = subscriptionIds.map(s => this.oid(s));

        return db
            .collection('responses')
            .updateMany({ subscriptionId: { $in : subscriptionIdsAsObjectId} }, { $set: { inactiveSubscription : true }});
    }

}

export default Experiment;
