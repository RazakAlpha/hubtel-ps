import {ResponseTypes, DataTypes, FieldTypes } from '../utilities'
import { SequnceHandler } from './sequenceHandler';
import { UssdRequest } from './ussdRequest';
import { USSDResponse } from './ussdResponse';

const loki = require('lokijs')
const db = new loki();

export class HubtelProgrammable {

    _sequenceOffset: number = 0;
    _handlers: SequnceHandler[] =[];
    _sequenceOffsetMap = new Map();
    _sessionData = new Map();
    _SessionMap = new Map();
    _maxDuration: number = 120000;
    
    _sessionManager = db.addCollection('sessionManager');
    // _sequence = db.addCollection('sequence');

    constructor(maxDuration = 120000){}


 process(request: UssdRequest): USSDResponse{
     // store session if new and set clean up period
        let storedSession: any;
        // console.log({request})

        if(request.Type === ResponseTypes.initiation){
            storedSession =  this.addSession(request);
        }else {
        //GET SESSION DATA STORED
        storedSession = this._sessionManager.find({id: request.SessionId});

        if(!storedSession) {
            console.error("All sequences must have a session stored");
            return this.errorResponse;
        }

        storedSession.sequence = request.Sequence;
        console.log({storedSession});

        this._sessionManager.update(storedSession);
        }

        console.log({storedSession});

       

    // find valid handler;
    const handler = this._handlers.find(el => el.validForSequence(storedSession.sequence, request.Message))
    if(!handler) {
        console.error("All sequences must have a handler assigned");
        return this.errorResponse;

    }

    const response: USSDResponse = handler.action();
    //Automatically set sessionId and Platform data
    response.SessionId =request.SessionId;
    response.Platform = request.Platform;
    response.formatMessage()

    return response;


 }

 // ONLY ADD INITIATION REQUESTS
 addSession(request: UssdRequest){
     return this._sessionManager.insert({id: request.SessionId, expireAt: new Date(new Date().getTime() + 1*1*15*60*1000), sequence: 0});
 }

 removeSessions(){
    this._sessionManager.findAndRemove({});
 }

 removeSession(sessionId: string){
    this._sessionManager.findAndRemove({id: sessionId});
 }

 addHandler(handler : SequnceHandler){
    this._handlers.push(handler)
 }

     
 public get errorResponse() : USSDResponse {
    return new USSDResponse({
        Type: ResponseTypes.release,
        Message: 'Unhandled error occurred',
        Label: 'Sorry, Unhandled error occurred whiles performing operation',
        DataType: DataTypes.select,
        FieldType: FieldTypes.number,
        ClientState: 'home',
    })
}



}