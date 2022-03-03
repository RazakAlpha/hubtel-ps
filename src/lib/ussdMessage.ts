import { iMessageWithOptions, MessageWithOptions } from "../utilities";

export class HubtelUSSDMessage {

    _message: MessageWithOptions;

    constructor(message: iMessageWithOptions) {
            this._message = new MessageWithOptions(message)

    }

    get message() {
        return { title: this._message.title, options:this._message.options, tag: this._message.tag }
    }

    
    get messageStringify() {
        return this._message.messageStringify;
    }

    


}