import { Instrument } from "../models/instrument.model";

export interface InstrumentsStore {
    getById(id: number): Instrument | undefined;
    getAll(): Instrument[];
}

export function createInstrumentStore(instruments: Instrument[]): InstrumentsStore {
    const byId = new Map<number, Instrument>();
    const allIds: number[] = [];
    
    for (const instrument of instruments) {
        byId.set(instrument.id, instrument);
        allIds.push(instrument.id);
    }

    return {
        getById(id: number) {
            return byId.get(id);
        },
        getAll() {
            return allIds.map(id => byId.get(id)!);
        }
    }
}