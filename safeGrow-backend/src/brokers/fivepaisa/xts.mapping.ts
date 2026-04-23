import { INSTRUMENT_CATALOGUE } from "../../config/instruments.js";

// 🗺️ XTS ID -> Symbol Mapping
export const XTS_SYMBOL_MAP: Record<string, string> = INSTRUMENT_CATALOGUE.reduce((acc, item) => {
    acc[item.xtsId] = item.symbol;
    return acc;
}, {} as Record<string, string>);

// 🔄 Symbol -> XTS ID Mapping (for Historical)
export const SYMBOL_TO_XTS_ID: Record<string, string> = INSTRUMENT_CATALOGUE.reduce((acc, item) => {
    acc[item.symbol] = item.xtsId;
    return acc;
}, {} as Record<string, string>);
