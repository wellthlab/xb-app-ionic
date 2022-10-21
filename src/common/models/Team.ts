import { nanoid } from 'nanoid';

import { BaseModel, ObjectId } from './utils';
import { IProfile, IProfileDocument } from './Account';

export interface ITeam {
    id: string;
    name: string;
    invite: string;
    members: string[];
    desc?: string;
}

export interface ITeamDocument extends Omit<ITeam, 'id' | 'members'> {
    _id: ObjectId;
    members: ObjectId[];
}

export interface ITeamMemberProfile extends Omit<IProfile, 'email' | 'office' | 'campus'> {}

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

    static async create(payload: Pick<ITeam, 'desc' | 'name'>): Promise<ITeam> {
        const db = this.getDb();

        const invite = nanoid(6);

        const result = await db.collection<ITeamDocument>('teams').insertOne({
            name: payload.name,
            desc: payload.desc,
            invite,
            members: [this.oid(this.client.currentUser!.id)],
        });

        return {
            id: result.insertedId.toString(),
            name: payload.name,
            desc: payload.desc,
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

    static async getMemberProfiles(ids: string[]): Promise<ITeamMemberProfile[]> {
        const db = this.getDb();

        const oids = ids.map(this.oid);

        const result = await db.collection<IProfileDocument>('profiles').find({
            _id: { $in: oids },
        });

        return result.map((item) => {
            const { _id, ...others } = item;
            return {
                id: _id.toString(),
                ...others,
            };
        });
    }
}

export default Team;
