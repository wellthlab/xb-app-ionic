import { BaseModel, ObjectId } from './utils';
import { convertObjectIdFieldsToString } from '../utils/helperFunctions';
import { Record } from 'phosphor-react';

export interface IBox {
    id: string;
    name: string;
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
    id: string;
}

export interface IExperiment extends IBaseExperiment {
    days: IDay[];
    preconditions?: any[];
    parent?: string;
    instructions?: string[];
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
}

interface IResponseDocument extends Omit<IResponse, 'id' | 'subscriptionId'> {
    _id: ObjectId;
    subscriptionId: ObjectId;
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
            .insertOne({ ...response, subscriptionId: this.oid(subscriptionId), createdAt: Date.now() });
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

    // static async getResponsesForDate(date: Date) {
    //     const startDate = new Date(date);
    //     startDate.setUTCHours(0, 0, 0, 0);
    //
    //     const endDate = new Date(date);
    //     endDate.setUTCHours(23, 59, 59, 9999);
    //
    //     const db = this.getDb();
    //
    //     const result = await db.collection<IResponseDocument>('responses').find(
    //         {
    //             userId: this.oid(this.client.currentUser!.id),
    //             createdAt: { $gte: startDate.getTime(), $lte: endDate.getTime() },
    //         },
    //         { sort: { createdAt: -1 } },
    //     );
    //
    //     return result.map((result: IResponseDocument) => {
    //         const { _id, userId, ...others } = result;
    //
    //         return {
    //             id: _id.toString(),
    //             userId: userId.toString(),
    //             ...others,
    //         };
    //     });
    // }
}

export default Experiment;
