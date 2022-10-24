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
    tags: string[];
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
    inputs?: (ITextInput | INumberInput | ISelectInput | IHeartrateInput | ICheckboxInput)[];
}

interface IGenericInput {
    optional?: boolean;
    label: string;
    help?: string;
}

interface ITextInput extends IGenericInput {
    type: 'text';
}

interface ICheckboxInput extends IGenericInput {
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

export interface IModuleDocument extends Omit<IModule, 'id'> {
    _id: ObjectId;
}

export interface IResponse {
    id: string;
    draft: boolean;
    payload: Record<string, string | number | boolean>;
}

interface IResponseDocument extends Omit<IResponse, 'id'> {
    _id: ObjectId;
    userId: ObjectId;
    moduleId: ObjectId;
    playlistId: number;
    taskId: number;
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

    static async submitTaskResponse(
        moduleId: string,
        playlistId: number,
        taskId: number,
        payload: IResponse['payload'],
        draft: boolean,
    ): Promise<IResponse> {
        const db = this.getDb();

        const result = (await db
            .collection<IResponseDocument>('responses')
            .findOneAndUpdate(
                { userId: this.oid(this.client.currentUser!.id), moduleId: this.oid(moduleId), taskId, playlistId },
                { $set: { draft, payload } },
                { upsert: true, returnNewDocument: true },
            ))!;

        return {
            id: result._id.toString(),
            payload: result.payload,
            draft: result.draft,
        };
    }

    static async getPlaylistResponses(moduleId: string, playlistId: number): Promise<(IResponse | undefined)[]> {
        const db = this.getDb();

        const result = await db.collection<IResponseDocument>('responses').find({
            userId: this.oid(this.client.currentUser!.id),
            moduleId: this.oid(moduleId),
            playlistId,
        });

        const ret: (IResponse | undefined)[] = [];

        for (const item of result) {
            ret[item.taskId] = {
                id: item._id.toString(),
                payload: item.payload,
                draft: item.draft,
            };
        }

        return ret;
    }
}

export default Box;
