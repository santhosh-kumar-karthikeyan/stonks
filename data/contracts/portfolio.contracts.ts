export interface PositionCompositeKey {
    zen_id: number;
    client_id: number;
    broker: string,
    account_id: number;
    strategy_id: number;
}

export interface RawPosition {
    position_composite_key: PositionCompositeKey;
    trading_symbol: string;
    position: number;
    open_cost: number;
    average_cost_per_share: number;
    latest_price: number;
    sod_price: number;
    unrealized_pnl: number;
    realized_pnl: number;
    cur_market_value: number;
    date: string;
}

interface PortfolioPayload {
    open_positions: RawPosition[];
    closed_position?: RawPosition[];
}

export type PortfolioResponse = {
    status: string;
    code: number;
    message: string;
    payload: PortfolioPayload;
}