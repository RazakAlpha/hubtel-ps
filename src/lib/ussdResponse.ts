import { Tracing } from "trace_events";
import { threadId } from "worker_threads";
import { DataTypes, FieldTypes, iMessageWithOptions, MessageWithOptions, ResponseTypes } from "../utilities";

export interface IUSSDResponse {
    SessionId?: string;
    Type: ResponseTypes;
    Message: string;
    Mask?: string;
    Item?: Object;
    ServiceCode?: string;
    Label: string;
    DataType: DataTypes;
    Data?: {Display: string, Value?: string, Amount?: number}[];
    FieldType: FieldTypes;
    Sequence?: number ;
    ClientState?: string
    Platform?: string;
    
}

export class USSDResponse implements IUSSDResponse {

    SessionId?: string;
    Type: ResponseTypes;
    Message: string;
    Mask?: string | undefined;
    Item?: Object | undefined;
    ServiceCode?: string | undefined;
    Label: string;
    DataType: DataTypes;
    Data?: {Display: string, Value?: string, Amount?: number}[];
    FieldType: FieldTypes;
    Sequence?: number | undefined;
    ClientState?: string | undefined;
    Platform?: string = 'USSD';


    constructor (response: IUSSDResponse ) {

        // if(!response.SessionId){
        //     throw new Error('Type is Required')
        // }else{
        //     this.SessionId = response.SessionId;
        // }

        if(!response.Type){
            this.Type = ResponseTypes.response // default to response
        }else {
            this.Type = response.Type
        }

        this.Mask = response.Mask;
        this.Item = response.Item;
        this.ServiceCode = response.ServiceCode;
        this.DataType = response.DataType;
        this.Data = response.Data;
        this.FieldType = response.FieldType;
        this.Sequence = response.Sequence;
        this.ClientState = response.ClientState;
        this.Platform = response.Platform;

        if(!response.Message){
            throw new Error('Message is Required')
        }else{
            this.Message = response.Message;
        }
    
        if(!response.Label){
            this.Label = response.Message;
        }else {
            this.Label = response.Label;
        }
    
        if(!response.DataType){
            throw new Error('DataType is Required')
        }
    
        if(!response.FieldType){
            this.FieldType = FieldTypes.text // default to Text
        }else{
            this.FieldType = response.FieldType;
        }
    
        if (response.Item){
            this.Item = response.Item;
        }

        if(!response.Data){
            this.Data = [];
        }else{
            this.Data = response.Data;
        }

        if (response.Platform === 'USSD'){
            this.Message = this.messageStringify;
        }
    }
    

    get message() {
        return this.Message;
    }

    get type() {
        return this.Type;
    }

    get clientState() {
        return this.ClientState;
    }

    get messageStringify() {
        let messageText = this.Message + '\n';

        if(this.Data && this.Data.length > 0 ){
            for (var i = 1; i <= this.Data.length; i++) {
                messageText = messageText + this.Data[i - 1].Value + '. ' + this.Data[i - 1].Display + '\n';
            }
        }

        console.log({messageText});
        return messageText;
    }

    //Set the value of message after Platform is set since platform is not accessible at the time of creating handler
    formatMessage(){
        if (this.Platform === 'USSD'){
            this.Message = this.messageStringify;
        }
    }


    



}