import { Collection } from 'lokijs';
import {ResponseTypes, DataTypes, FieldTypes, IPaymentProcessingResults, ServiceStatus } from '../utilities'
import { IPaymentCallback, PaymentCallback } from './paymentRequest';
import { SequenceHandler } from './sequenceHandler';
import { Request } from './ussdRequest';
import { Response } from './ussdResponse';

const loki = require('lokijs')
const db = new loki();

type paymentCallbackFunction = (arg?: PaymentCallback) => IPaymentProcessingResults;

export class HubtelProgrammable {

    _sequenceOffset: number = 0;
    _handlers: SequenceHandler[] =[];
    _sequenceOffsetMap = new Map();
    _sessionData = new Map();
    _SessionMap = new Map();
    _maxDuration: number = 120000;
    _interval : NodeJS.Timer
    _sessionManager : Collection;
    // _sequence = db.addCollection('sequence');
    
    constructor(maxDuration = 120000){
       
       this._sessionManager = db.addCollection('sessionManager');
      //  console.log(this._sessionManager, 'session manager');
       this._interval = setInterval(this.removeExpiredSessions, maxDuration, this._sessionManager); // set time to run a cron job to remove existing sessions
    }


    /**
     * 
     * @param request UssdRequest UssdRequest sent by provider
     * @returns Promise<USSDResponse>
     */
  async process(request: Request): Promise<Response>{
     // store session if new and set clean up period
        let storedSession: any;
        console.log({request})

        if(request.Type === ResponseTypes.initiation){
            storedSession =  this.addSession(request);

        }else {
        //GET SESSION DATA STORED
        storedSession = this.getSessionData(request.SessionId);

        if(!storedSession) {
            console.error("All sequences must have a session stored");
            return this.errorResponse;
        }

        storedSession.sequence = request.Sequence;

        if(request.ClientState){ // save the user input of the clientState was set
           storedSession[request.ClientState] = request.Message;
        }

      //   console.log({storedSession});

        this._sessionManager.update(storedSession);
        console.log("🚀 ~ file: hubtelProgrammable.ts ~ line 64 ~ HubtelProgrammable ~ process ~ storedSession", storedSession)

        
        }

      //   console.log({storedSession});

       

    // find valid handler;
    const handler = this._handlers.find(el => el.validForSequence(storedSession.sequence, request.Message))
    if(!handler) {
        console.error("All sequences must have a handler assigned");
        return this.errorResponse;

    }

    handler.ussdRequest = request;
    const response: Response =  await handler.action(request);
   //  console.log({response})
    //Automatically set sessionId and Platform data
    response.SessionId =request.SessionId;
    response.Platform = request.Platform;
    response.formatMessage()

    return response;


 }

 // ONLY ADD INITIATION REQUESTS
 addSession(request: Request){
     return this._sessionManager.insert({id: request.SessionId, expireAt: new Date(new Date().getTime() + 1*1*1*60*1000), sequence: request.Sequence});
 }

 removeSessions(){
    this._sessionManager.findAndRemove({});
 }

 removeSession(sessionId: string){
    this._sessionManager.findAndRemove({id: sessionId});
 }
 removeExpiredSessions(sessionManager: Collection){
   //  console.log(sessionManager.find({}), 'expired sessions')
    sessionManager.findAndRemove({expireAt: {$lte: new Date()}});
   //  console.log(sessionManager.find({}), 'expired sessions')
 }

 addHandler(handler : SequenceHandler){
    this._handlers.push(handler)
 }

 addHandlers(handlers : SequenceHandler[]){
    this._handlers =  this._handlers.concat(handlers);
 }

 clearHandlers(){
    this._handlers =  [];  
 }

getSessionData(sessionId: string){
   return this._sessionManager.findOne({id: sessionId});
 }

 async processPayment(paymentRequest: IPaymentCallback, callbackFn: paymentCallbackFunction){
    const payement = new PaymentCallback(paymentRequest);
    const res = await callbackFn(payement);
   //  console.log({res})
    if (!res.ServiceStatus){
       res.ServiceStatus = ServiceStatus.unknown;
    }
    res.SessionId = paymentRequest.SessionId;
    res.OrderId = paymentRequest.OrderId;
    return res

 }

     
 public get errorResponse() : Response {
    return new Response({
        Type: ResponseTypes.release,
        Message: 'Unhandled error occurred',
        Label: 'Sorry, Unhandled error occurred whiles performing operation',
        DataType: DataTypes.select,
        FieldType: FieldTypes.number,
        ClientState: 'home',
    })
}



}