

class Handler {
    constructor(preTest) {
        this.preTest = preTest;
        this.handler = [];
        this.registerHandler = this.registerHandler.bind(this);
        this.handle = this.handle.bind(this);
    }


    registerHandler (regex, proccessor){
        this.handler.push({ regex, proccessor });
    }

    async handle(context) {
        const {req} = context;
        const {url} = req;
        console.log(url);
        if (this.preTest && !url.match(this.preTest)) {
            return false;
        }
        for (let i = 0; i < this.handler.length; i++) {
            let obj = this.handler[i];
            let match;
            if (match = url.match(obj.regex)) {
                console.log("match" + obj.regex);
                await obj.proccessor(match, context);
                return true;
            }
        }
        return false;
    }

}
module.exports = Handler;