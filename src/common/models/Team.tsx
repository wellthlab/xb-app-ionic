import { BaseModel, ObjectId } from './utils';
import { nanoid } from 'nanoid';

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

    static async create(name: string): Promise<ITeam> {
        const db = this.getDb();

        const invite = nanoid(6);

        const result = await db
            .collection<ITeamDocument>('teams')
            .insertOne({ name, invite, members: [this.oid(this.client.currentUser!.id)] });

        return {
            id: result.insertedId.toString(),
            name,
            invite,
            members: [this.client.currentUser!.id],
        };
    }

    static async join(invite: string): Promise<ITeam> {
        const db = this.getDb();

        const result = await db.collection<ITeamDocument>('teams').findOne({ invite });
        if (!result) {
            throw new Error('Sorry, the invite code did not correspond to any team');
        }

        await db
            .collection<ITeamDocument>('teams')
            .updateOne({ _id: result._id }, { $push: { members: this.oid(this.client.currentUser!.id) } });

        return {
            id: result._id.toString(),
            name: result.name,
            invite: result.invite,
            members: [...result.members.map((memberId) => memberId.toString()), this.client.currentUser!.id],
        };
    }
}

export default Team;
