import { RawPosition, PortfolioResponse, PositionCompositeKey } from "../contracts/portfolio.contracts";
import { Position } from "../models/position.model";


function buildPositionId(key: PositionCompositeKey): string {
    return `${key.zen_id}-${key.client_id}-${key.account_id}-${key.broker}-${key.strategy_id}`;
}

function transformRawPosition(raw: RawPosition): Position {
    return {
        id: buildPositionId(raw.position_composite_key),
        instrumentId: raw.position_composite_key.zen_id,
        symbol: raw.trading_symbol,
        quantity: raw.position,
        avgPrice: raw.average_cost_per_share,
        openCost: raw.open_cost,
        ltp: raw.latest_price,
        dayOpenPrice: raw.sod_price,
        unrealizedPnl: raw.unrealized_pnl,
        realizedPnl: raw.realized_pnl,
        marketValue: raw.cur_market_value,
        date: raw.date
    }
}

export function transformPortfolioResponse(response: PortfolioResponse): Position[] {
    return response.payload.open_positions.map(transformRawPosition);
}