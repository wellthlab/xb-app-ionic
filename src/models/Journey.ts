import { BaseModel, ObjectId } from './utils';

export interface IJourney {
    id: string,
    date: Date;
    userId: string;
    route: [L.LatLngLiteral, L.LatLngLiteral];
    start: L.LatLngLiteral;
    end: L.LatLngLiteral;
    payload: Record<string, string>;
    transport: Transport[];
    createdAt: number;

}

interface IJourneyDocument extends IJourney {
    _id: ObjectId;
}

// Need to add other transports: Scooter, Bus, Train, Tube, Car
export type Transport =
    | IWalking
    | ICycling

export interface IGenericTransport {
    label: string;
}

interface IWalking extends IGenericTransport {
    label: "walking"
}

interface ICycling extends IGenericTransport {
    label: "cycling"
}

class Experiment extends BaseModel {
    static async getJourneys(): Promise<IJourney[]> {
        const db = this.getDb();

        const result = await db.collection<IJourneyDocument>('journeys').find();

        return result.map((item) => {
            const { _id, userId, ...others } = item;
            return {
                _id: _id.toString(),
                userId: userId.toString(), ...others
            };
        });
    }

    static saveJourney(journey: IJourney) {
        const db = this.getDb();

        return db
            .collection<IJourneyDocument>('journeys')
            .updateOne({ _id: this.oid(journey.id), userId: this.oid(this.client.currentUser!.id)}, { ...journey, createdAt: Date.now() }, { upsert: true });
    }
}

export default Experiment;
