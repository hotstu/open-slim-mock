const Handler = require("../handler");

const fallback = new Handler();
fallback.registerHandler(/[\s\S]+/, async (match, {res, endWithText})=> {
    return await endWithText(res, JSON.stringify({"error":"404, router is not configured"}), 404);
});

module.exports = fallback;