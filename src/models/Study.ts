import { Block } from './Experiment';
import { BaseModel, ObjectId } from './utils';

export interface IStudy {
    id: string;
    studyInfo: Block[];
    consent: string[];
    profile: Block[];
    welcome: { title: string; blocks: Block[] }[];
}

interface IStudyDocument extends Omit<IStudy, 'id'> {
    _id: ObjectId;
}

class Study extends BaseModel {
    static async getCurrentStudy(): Promise<IStudy> {
        const db = this.getDb();

        const result = await db.collection<IStudyDocument>('studyinfo').findOne({});

        const { _id, ...others } = result!;
        return {
            ...others,
            id: _id.toString(),
        };
    }
}

export default Study;
