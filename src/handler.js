

class Handler {
    constructor() {
        this.handler = [];
        this.registerHandler = this.registerHandler.bind(this);
        this.handle = this.handle.bind(this);
    }


    registerHandler (regex, proccessor){
        this.handler.push({ regex, proccessor });
    }

    handle (context) {
        const { req } = context;
        const { url } = req;
        for (let i = 0; i < this.handler.length; i++) {
            let obj = this.handler[i];
            let match;
            if (match = url.match(obj.regex) && obj.proccessor(match, context)) {
                return true;
            }
        }
        return false;
    }

}
module.exports = Handler;