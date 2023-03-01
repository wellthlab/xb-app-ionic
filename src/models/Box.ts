import { BaseModel, ObjectId } from './utils';

export interface IBox {
    name: string;
    icon: string;
    desc: string;
    duration: number;
    days: IDay[];
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
        | IHeartrateInput
        | ICheckbox
        | IPara
        | IGreenDetector
        | ICountdownTimer
    )[];
}

interface IGenericInput {
    optional?: boolean;
    label: string;
    help?: string;
    rk?: string;
}

interface ITextInput extends IGenericInput {
    type: 'text';
}

interface ICheckbox extends IGenericInput {
    type: 'checkbox';
}

interface INumberInput extends IGenericInput {
    type: 'number';
}

interface ISelectInput extends IGenericInput {
    type: 'select';
    options: string[];
}

interface IHeartrateInput extends IGenericInput {
    type: 'heartrate';
}

interface IPara {
    type: 'para';
    content: string;
}

interface IGreenDetector {
    type: 'green-detector';
    rk?: string;
}

interface ICountdownTimer {
    type: 'countdown';
    fixedDuration?: number;
    rk?: string;
}

interface IReponse {
    box: string;
    day: number;
    task: number;
    payload: Record<string, string | number>;
}

class Box extends BaseModel {
    static async getBoxes(): Promise<IBox[]> {
        const db = this.getDb();

        const result = await db.collection<IBoxDocument>('boxes').find();

        return result.map((item) => {
            const { _id, ...others } = item;
            return others;
        });
    }
}

export default Box;
