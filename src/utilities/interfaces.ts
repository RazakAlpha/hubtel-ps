import { stringify } from "querystring";

export enum ResponseTypes{
    initiation ='Initiation',
    response ='Response',
    release = 'Release',
    timeout = 'Timeout',
    addtocart = 'AddToCart'
}

export enum FieldTypes {
    text = 'text',
    phone = 'phone',
    email = 'email',
    number =  'number',
    decimal =  'decimal',
    textarea =  'textarea'
}

export enum DataTypes {
    display = 'display',
    input = 'input',
    confirm = 'confirm',
    select = 'select'
}

export interface iMessageWithOptions{
    title: string;
    options: string[];
    tag: string;
}

export class MessageWithOptions implements iMessageWithOptions {
    title: string;
    options: string[];
    tag: string;

    constructor(message: iMessageWithOptions) {
        this.title  = message.title || 'Welcome. No Menu Available';
        this.options = message.options || [];
        this.tag = message.tag ||  '';
    }

    get messageStringify() {
        let messageText = this.title + '\n';

        for (var i = 1; i <= this.options.length; i++) {
            messageText = messageText + i + '. ' + this.options[i - 1] + '\n';
        }
        return messageText;
    }

}





