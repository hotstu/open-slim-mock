

class Handler {
    constructor(preTest) {
        this.preTest = preTest;
        this.handler = [];
        this.registerHandler = this.registerHandler.bind(this);
        this.handle = this.handle.bind(this);
    }


    registerHandler (regex, processor){
        this.handler.push({ regex, processor });
    }

    async handle(context) {
        const {req} = context;
        const {url} = req;
        //console.log(url);
        if (this.preTest && (typeof this.preTest) === "function" && !this.preTest(req)) {
            return false;
        }
        if (this.preTest && !url.match(this.preTest)) {
            return false;
        }
        for (let i = 0; i < this.handler.length; i++) {
            const {regex, processor} = this.handler[i];
            let match;
            if (match = url.match(regex)) {
                //console.log("match" + regex);
                await processor(match, context);
                return true;
            }
        }
        return false;
    }

}
module.exports = Handler;