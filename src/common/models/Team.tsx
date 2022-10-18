import { BaseModel, ObjectId } from './utils';

export interface ITeam {
    id: string;
    name: string;
    invite: string;
    members: string[];
}

interface ITeamDocument extends Omit<ITeam, 'id' | 'members'> {
    _id: ObjectId;
    members: ObjectId[];
}

class Team extends BaseModel {
    static async getCurrentTeam(): Promise<ITeam | null> {
        const db = this.getDb();

        const result = await db.collection<ITeamDocument>('teams').findOne({
            members: this.oid(this.client.currentUser!.id),
        });

        if (!result) {
            return null;
        }

        const { _id, members, ...others } = result;

        return {
            ...others,
            id: _id.toString(),
            members: members.map((member) => member.toString()),
        };
    }
}

export default Team;
