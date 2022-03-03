import { HubtelProgrammable } from "./hubtelProgrammable";
import { UssdRequest } from "./ussdRequest";

export * from './ussdRequest'
export * from './ussdResponse'
export * from './sequenceHandler'
export * from '../utilities'

let _hubtelProgrammable: HubtelProgrammable;

export function init() {
   _hubtelProgrammable = new HubtelProgrammable();
   return _hubtelProgrammable;
}

export function engine() {
   return _hubtelProgrammable;
}

export function processRequest(ussdRequest: UssdRequest){
    return _hubtelProgrammable.process(ussdRequest);
}

