import { nanoid } from 'nanoid';

import { BaseModel, ObjectId } from './utils';
import Account, { IAccount, IAccountDocument } from './Account';

export interface ITeam {
    id: string;
    name: string;
    invite: string;
    members: IAccount[];
    desc?: string;
}

export interface ITeamDocument extends Omit<ITeam, 'id' | 'members'> {
    _id: ObjectId;
    members: ObjectId[];
}

class Team extends BaseModel {
    static async getCurrentTeam(): Promise<ITeam | null> {
        const db = this.getDb();

        const result = await db
            .collection<ITeamDocument>('teams')
            .findOne({ members: this.oid(this.client.currentUser!.id) });

        if (!result) {
            return null;
        }

        const members = await this._getMembers(result.members);

        const { _id, ...others } = result;

        return {
            ...others,
            id: _id.toString(),
            members,
        };
    }

    static async create(payload: Pick<ITeam, 'desc' | 'name'>): Promise<ITeam> {
        const db = this.getDb();

        const invite = nanoid(6);
        const membersArray = [this.oid(this.client.currentUser!.id)];

        const result = await db.collection<ITeamDocument>('teams').insertOne({
            name: payload.name,
            desc: payload.desc,
            invite,
            members: membersArray,
        });

        const members = await this._getMembers(membersArray);

        return {
            id: result.insertedId.toString(),
            name: payload.name,
            desc: payload.desc,
            invite,
            members,
        };
    }

    static async join(invite: string): Promise<ITeam> {
        const db = this.getDb();

        const result = await db
            .collection<ITeamDocument>('teams')
            .findOneAndUpdate({ invite }, { $push: { members: this.oid(this.client.currentUser!.id) } });

        if (!result) {
            throw new Error('Sorry, the invite code did not correspond to any team');
        }

        const members = await this._getMembers(result.members);

        return {
            id: result._id.toString(),
            name: result.name,
            invite: result.invite,
            members,
        };
    }

    private static async _getMembers(ids: ObjectId[]): Promise<IAccount[]> {
        const db = this.getDb();

        const result = await db.collection<IAccountDocument>('accounts').find({
            _id: { $in: ids },
        });

        return result.map(Account.transformDocument);
    }
}

export default Team;
