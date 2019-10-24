import { createBrowserHistory } from 'history'

class History {
    constructor() {
        if (History.instance) {
            return History.instance
        }
        this.loc = createBrowserHistory({
            forceRefresh: false // Set true to force full page refreshes
        });
        History.instance= this;
    }

    subscribe = (cb) => {
        return this.loc.listen((location, action)=>{
            cb(location,action)
        })
    }
}
const instance = new History()
export default instance
