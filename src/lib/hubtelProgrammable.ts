import { Collection } from 'lokijs';
import {ResponseTypes, DataTypes, FieldTypes, IPaymentProcessingResults, ServiceStatus } from '../utilities'
import { IPaymentRequest, PaymentRequest } from './paymentRequest';
import { SequenceHandler } from './sequenceHandler';
import { Request } from './ussdRequest';
import { IResponseData, Response } from './ussdResponse';

const loki = require('lokijs')
const db = new loki();

type paymentCallbackFunction = (arg?: PaymentRequest) => IPaymentProcessingResults;

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

      //   SAVING USER INPUT FOR FUTURE QUERY
        if(request.ClientState){ // save the user input of the clientState was set

         // IF SELECTLIST EXIST ON STOREDDATA, THE EXTRACT THE VALUE FOR SAVING
         if(storedSession.selectList && storedSession.selectList.length > 0){ 
            //SELECTEDLIST IS SET WHEN A RESPONSE IS CREATED WITH DATA OPTIONS
            //FILTER SELECTED IF INPUT IS EQUAL TO INDEX+1 OR VALUE OF LIST ITEM
            const selected = storedSession.selectList.find((el:IResponseData, index: number) => index+1 === Number(request.Message) || String(el.Value).toLowerCase() ===String(request.Message).toLowerCase())
           if (selected){
            storedSession[request.ClientState] = String(selected.Value).toLowerCase(); // STOREDSESSION.CLIENTSTATE = 'SOMETHING'
           storedSession['currentSelection'] = String(selected.Value).toLowerCase(); // STOREDSESSION.CURRENTSELECTION = 'SOMETHING'
           }

        }else{ //IF NO SELECTED LIST WAS SET THEN SAVE THE USER INPUT AS IT IS
         storedSession[request.ClientState] = request.Message;
         storedSession['currentSelection'] = undefined; // CLEAR CURRENT SELECTION

        }
      }

      //   console.log({storedSession});

        this._sessionManager.update(storedSession);
        console.log("🚀 ~ file: hubtelProgrammable.ts ~ line 64 ~ HubtelProgrammable ~ process ~ storedSession", storedSession);
        }

      //   console.log({storedSession});

       

    // find valid handler;
    // USES CURRENT SELECTION OBTAINED FROM USER INPUT
    const handler = this._handlers.find(el => el.validForSequence(storedSession.sequence, storedSession.currentSelection));

    if(!handler) {
        console.error("All sequences must have a handler assigned");
        return this.errorResponse;

    }

    handler.ussdRequest = request;
    const response: Response =  await handler.action(request);
   console.log({handler})
   //Automatically set sessionId and Platform data
    response.SessionId = request.SessionId;
    response.Platform = request.Platform;
    storedSession.selectList = response.Data && response.Data.length > 0? response.Data: undefined; // SAVE THE DATA AS THE SELECTLIST FOR ACCESS ON NEXT SEQUENCE
    response.formatMessage();


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

 async processPayment(paymentRequest: IPaymentRequest, callbackFn: paymentCallbackFunction){
    const payement = new PaymentRequest(paymentRequest);
    const res = await callbackFn(payement);
   //  console.log({res})
    if (!res.ServiceStatus){
       res.ServiceStatus = ServiceStatus.unknown;
    }
    res.SessionId = paymentRequest.SessionId;
    res.OrderId = paymentRequest.OrderId;
    return res

 }

 getUserInput(sessionId: string, key: string){
    const storedSession = this.getSessionData(sessionId);
   return  storedSession.selectedList.find((el:IResponseData, index: number) => String(el.Value) ===key)
 }

 set selectList(param: {sessionId: string, data: IResponseData[]}){
   const storedSession = this.getSessionData(param.sessionId);
   storedSession.selectList = param.data;

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