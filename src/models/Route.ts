import { BaseModel, ObjectId } from "./utils";

export interface IRoutes {
    userId: string,
    route: [IPoints],
    createdAt: number
}

interface IRoutesDocument extends Omit<IRoutes, 'userId' | 'id'> {
    _id: ObjectId,
    userId: ObjectId
}

interface IPoints {
    lat: number,
    lng: number,
    type: pointType
}

enum pointType {
    start,
    point,
    end
}

class Routes extends BaseModel {
    static async getRoutes(): Promise<IRoutes[]> {
        const db = this.getDb();

        const result = await db.collection<IRoutesDocument>('routes').find();

        return result.map((item) => {
                const { _id, userId, ...others } = item;
                return {
                    ...others,
                    id: _id.toString(),
                    userId: userId.toString()
                };
        });
    }

    static saveRoute(route: Omit<IRoutes, 'userId' | 'createdAt' | 'id'>) {
        const db = this.getDb();

        return db
            .collection<IRoutesDocument>('routes')
            .insertOne({ ...route, userId: this.oid(this.client.currentUser!.id), createdAt: Date.now() });
    }
}

export default Routes;
