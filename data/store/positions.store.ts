import { Position } from "../models/position.model";

export interface PositionsStore {
    getById(id: string): Position | undefined;
    getAll(): Position[];
}

export function createPositionsStore(positions: Position[]): PositionsStore {
    const byId = new Map<string, Position>();
    const allIds: string[] = [];
    for (const position of positions) {
        byId.set(position.id, position);
        allIds.push(position.id);
    }
    return {
        getById(id: string) {
            return byId.get(id);
        },
        getAll() {
            return allIds.map(id => byId.get(id)!);
        }
    }
}