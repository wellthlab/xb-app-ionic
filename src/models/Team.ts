import { customAlphabet } from 'nanoid';

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

const generateInvite = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ', 6);

class Team extends BaseModel {
    static async getCurrentTeam(): Promise<ITeam | null> {
        const db = this.getDb();

        const result = await db
            .collection<ITeamDocument>('teams')
            .findOne({ members: this.oid(this.client.currentUser!.id) });

        if (!result) {
            return null;
        }

        const memberProfiles = await this._getMembers(result.members);

        const { _id, members, ...others } = result;
        return {
            ...others,
            id: _id.toString(),
            members: memberProfiles,
        };
    }

    static async create(payload: Pick<ITeam, 'desc' | 'name'>) {
        const db = this.getDb();

        const invite = generateInvite();
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

    static async join(invite: string) {
        const db = this.getDb();

        const result = await db
            .collection<ITeamDocument>('teams')
            .findOneAndUpdate(
                { invite },
                { $push: { members: this.oid(this.client.currentUser!.id) } },
                { returnNewDocument: true },
            );

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

    static leave() {
        const db = this.getDb();

        const id = this.oid(this.client.currentUser!.id);
        return db.collection<ITeamDocument>('teams').updateOne({ members: id }, { $pull: { members: id } });
    }

    private static async _getMembers(ids: ObjectId[]): Promise<IAccount[]> {
        const db = this.getDb();

        const result = await db.collection<IAccountDocument>('accounts').find({
            _id: { $in: ids },
        });

        const transformedDocuments = result.map(Account.fromDocument);

        // Sort ids to follow the member ids
        // This is because we want to display the members in the order they joined
        // Also, the first member is the owner, so another reason why we want the original order

        const stringifiedIds = ids.map((id) => id.toString());

        const ret = [];
        for (const document of transformedDocuments) {
            ret[stringifiedIds.indexOf(document.id)] = document;
        }

        return ret;
    }
}

export default Team;
