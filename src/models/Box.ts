import { BaseModel, ObjectId } from './utils';

export interface IBox {
    name: string;
    icon: string;
    desc: string;
    duration: number;
    days: IDay[];
    containsExercise?: boolean;
}

export interface IBoxDocument extends IBox {
    _id: ObjectId;
}

export interface IDay {
    name: string;
    desc: string;
    tasks: ITask[];
}

export interface ITask {
    name: string;
    hideIf?: string;
    icon?: string;
    blocks: (
        | ITextInput
        | INumberInput
        | ISelectInput
        | ISliderInput
        | IHeartRateInput
        | ICheckbox
        | ITimeInput
        | IPara
        | IGreenDetector
        | ICountdownTimer
    )[];
}

export interface IGenericInput {
    optional?: boolean;
    label: string;
    help?: string;
    rk: string;
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

interface IPara {
    type: 'para';
    content: string;
}

interface ICountdownTimer {
    type: 'countdown';
    duration: number;
    fixed?: boolean;
}

export interface IResponse {
    id: string;
    userId: string;
    box: string;
    dayId: number;
    taskId: number;
    payload: Record<string, string | number>;
    createdAt: number;
}

interface IResponseDocument extends Omit<IResponse, 'userId' | 'id'> {
    _id: ObjectId;
    userId: ObjectId;
}

class Box extends BaseModel {
    static async getBoxes() {
        const db = this.getDb();

        const result = await db.collection<IBoxDocument>('boxes').find();

        return result.map((item) => {
            const { _id, ...others } = item;
            return others;
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
            const { _id, ...others } = result;

            return {
                id: _id.toString(),
                ...others,
                userId: others.userId.toString(),
            };
        });
    }
}

export default Box;
