// In a real application, this would query MongoDB. For demonstration, we use an in-memory map.
const usageMap = new Map();

export const checkFreeLimit = (req, res, next) => {
    // Identify user by IP or an optional Header (e.g. x-user-id)
    const userId = req.headers['x-user-id'] || req.ip;
    const isPro = req.headers['x-is-pro'] === 'true'; // Mock pro check

    if (isPro) {
        return next(); // Pro users have unlimited access
    }

    const currentUsage = usageMap.get(userId) || 0;

    if (currentUsage >= 1) {
        return res.status(403).json({
            error: "Free tier limit reached. Please upgrade to Pro for unlimited resume analysis, GitHub deep dives, and Cover Letter generation.",
            upgrade_required: true
        });
    }

    // Increment usage 
    usageMap.set(userId, currentUsage + 1);
    req.isPro = false; // Add context for the controller
    next();
};
