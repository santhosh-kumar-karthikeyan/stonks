export type InstrumentType = 'EQ' | 'FUT' | 'PE' | 'CE';

export type SecurityInstrument = {
  zen_id: number;
  trading_symbol: string;
  expiry_date: string | null;
  strike: number;
  exchanges: string[];
  lot_size: number;
  instrument_type: InstrumentType;
  name: string;
  expiry_type: string | null;
};

type SecuritiesPayload = Partial<Record<InstrumentType, SecurityInstrument[]>>;

export type SecuritiesResponse = {
  status: string;
  code: number;
  message: string;
  payload: SecuritiesPayload;
};
