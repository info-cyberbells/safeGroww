import { IBroker } from "./IBroker.js";
import { FyersBroker } from "./fyers/index.js";
import { FivePaisaBroker } from "./fivepaisa/index.js";

// map of all brokers
const brokerMap: Record<string, () => IBroker> = {
    fyers: () => new FyersBroker(),
    fivepaisa: () => new FivePaisaBroker(),
    // 5paisa: () => new FivePaisaBroker(),  ← add later
    // zerodha: () => new ZerodhaBroker(),   ← add later
};

// single instance cache
let instance: IBroker | null = null;

const getBroker = (): IBroker => {
    if (instance) return instance;

    const brokerName = process.env.BROKER || "fyers";
    const factory = brokerMap[brokerName];

    if (!factory) throw new Error(`Broker "${brokerName}" not supported`);

    instance = factory();
    return instance;
};

export default getBroker;