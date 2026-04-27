let activeSystemBroker = (process.env.BROKER || "fyers").toLowerCase();

export const getActiveSystemBroker = () => activeSystemBroker;

export const setActiveSystemBroker = (name: string) => {
    activeSystemBroker = name.toLowerCase();
};

/**
 * Returns the next broker in the priority list for fallback
 */
export const getNextFallbackBroker = (currentBroker: string) => {
    const list = (process.env.SYSTEM_BROKER_LIST || "fyers,fivepaisa")
        .toLowerCase()
        .split(",")
        .map(s => s.trim());
    
    const currentIndex = list.indexOf(currentBroker.toLowerCase());
    
    // If not found in list or is the last one, wrap around to the first one
    const nextIndex = (currentIndex + 1) % list.length;
    return list[nextIndex];
};
