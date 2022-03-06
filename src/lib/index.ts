import { HubtelProgrammable } from "./hubtelProgrammable";
import { Request } from "./ussdRequest";

export * from './ussdRequest'
export * from './ussdResponse'
export * from './sequenceHandler'
export * from './paymentRequest'
export * from '../utilities'

let _hubtelProgrammable: HubtelProgrammable;

export function init(maxDuration?: number) {
   _hubtelProgrammable = new HubtelProgrammable(maxDuration);
   return _hubtelProgrammable;
}

export function engine() {
   return _hubtelProgrammable;
}
export function getSessionData(sessionId: string){
   return _hubtelProgrammable.getSessionData(sessionId);
 }

export function processRequest(ussdRequest: Request){
    return _hubtelProgrammable.process(ussdRequest);
}

