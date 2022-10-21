import { BaseModel, ObjectId } from './utils';

export interface IBox {
    type: string;
    title: string;
    stages: IStage[];
}

interface IStage {
    day: number;
    title: string;
    desc: string;
}

export interface IBoxDocument extends IBox {
    _id: ObjectId;
}

export interface IModule {
    id: string;
    name: string;
    topic?: string;
    desc?: string;
    box: string;
    difficulty: string;
    playlists: IPlaylist[];
}

export interface IPlaylist {
    name: string;
    duration: { magnitude: number; unit: string };
    tasks: ITask[];
}

export interface ITask {
    name: string;
    desc?: string;
    icon?: string;
    video?: string;
    inputs?: (ITextInput | INumberInput | ISelectInput | ISliderInput | IHeartrateInput)[];
}

interface IGenericInput {
    optional?: boolean;
    label: string;
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

interface ISliderInput extends IGenericInput {
    type: 'slider';
    step?: number;
    range: [number, number];
}

interface IHeartrateInput extends IGenericInput {
    type: 'heartrate';
}

export interface IModuleDocument extends Omit<IModule, 'id'> {
    _id: ObjectId;
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

    static async getAllModules(): Promise<IModule[]> {
        const db = this.getDb();

        const result = await db.collection<IModuleDocument>('modules').find();

        return result.map((item) => {
            const { _id, ...others } = item;
            return {
                id: _id.toString(),
                ...others,
            };
        });
    }
}

export default Box;
