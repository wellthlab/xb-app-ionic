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
    userId: string;
    moduleId: string;
    playlistId: number;
    taskId: number;
    draft: boolean;
    payload: Record<string, string | number | boolean | null>;
}

interface IResponseDocument extends Omit<IResponse, 'id' | 'userId' | 'moduleId'> {
    _id: ObjectId;
    userId: ObjectId;
    moduleId: ObjectId;
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

    static submitTaskResponse(
        moduleId: string,
        playlistId: number,
        taskId: number,
        payload: IResponse['payload'],
        draft: boolean,
    ) {
        const db = this.getDb();

        return db
            .collection<IResponseDocument>('responses')
            .updateOne(
                { userId: this.oid(this.client.currentUser!.id), moduleId: this.oid(moduleId), taskId, playlistId },
                { $set: { draft, payload } },
                { upsert: true },
            );
    }

    static async getPlaylistResponses(moduleId: string, playlistId: number): Promise<IResponse[]> {
        const db = this.getDb();

        const result = await db.collection<IResponseDocument>('responses').find({
            userId: this.oid(this.client.currentUser!.id),
            moduleId: this.oid(moduleId),
            playlistId,
        });

        return result.map((item) => ({
            id: item._id.toString(),
            userId: item.userId.toString(),
            moduleId: item.moduleId.toString(),
            playlistId: item.playlistId,
            taskId: item.taskId,
            payload: item.payload,
            draft: item.draft,
        });
    }
}

export default Box;
