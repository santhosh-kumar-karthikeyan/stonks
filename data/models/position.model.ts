export interface Position {
    id: string,
    instrumentId: number;
    symbol: string;
    quantity: number;
    avgPrice: number;
    openCost: number;
    ltp: number;
    dayOpenPrice: number;
    unrealizedPnl: number;
    realizedPnl: number;
    marketValue: number;
    date: string;
}