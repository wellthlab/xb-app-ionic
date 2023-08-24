import { BaseModel, ObjectId } from "./utils";

export interface IRoutes {
    userId: string,
    route: IPoints[],
    createdAt: number
}

interface IRoutesDocument extends Omit<IRoutes, 'userId' | 'id'> {
    _id: ObjectId,
    userId: ObjectId
}

export interface IPoints {
    lat: number,
    lng: number,
    type: pointType
}

export enum pointType {
    start = "start",
    point = "point",
    end = "end"
}

class Routes extends BaseModel {
    static async getRoutes(): Promise<IRoutes[]> {
        const db = this.getDb();

        const startDate = new Date();
        startDate.setUTCHours(0, 0, 0, 0);

        const endDate = new Date(startDate);
        endDate.setUTCHours(23, 59, 59, 9999);

        let result = await db.collection<IRoutesDocument>('routes').find({
            userId: this.oid(this.client.currentUser!.id),
            createdAt: { $gte: startDate.getTime(), $lte: endDate.getTime() }},
            { sort: { createdAt: 1 } },
        );

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
