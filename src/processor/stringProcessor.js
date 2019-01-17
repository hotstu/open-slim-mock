const Processor = (text) => async (match, {res, endWithText}) => {
    return await endWithText(res, text);
}


module.exports = Processor;