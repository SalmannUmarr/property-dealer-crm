const requestStore = new Map();

export function rateLimit({ key, limit, windowMs }) {
    const now = Date.now();

    const record = requestStore.get(key) || {
        count: 0,
        startTime: now,
    };

    if (now - record.startTime > windowMs) {
        record.count = 1;
        record.startTime = now;
    } else {
        record.count += 1;
    }

    requestStore.set(key, record);

    if (record.count > limit) {
        return {
            allowed: false,
            remaining: 0,
        };
    }

    return {
        allowed: true,
        remaining: limit - record.count,
    };
}