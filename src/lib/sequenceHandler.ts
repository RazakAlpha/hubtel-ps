import { ResponseTypes } from "../utilities";
import { USSDResponse } from "./ussdResponse";

type HandlerFunction = (arg?: any) => USSDResponse;

export interface ISequenceHandler {
    SequenceIds: number[];
    stateData?: string;
    Type: ResponseTypes;
    action: Function

}

export class SequnceHandler implements ISequenceHandler {
    SequenceIds: number[];
    stateData?: string;
    Type: ResponseTypes;
    action: HandlerFunction;

    constructor(SequenceIds: number[], stateData: string | undefined, Type: ResponseTypes, action: HandlerFunction) {
        this.SequenceIds = SequenceIds;
        this.stateData = stateData? String(stateData) : undefined;
        this.Type = Type;
        this.action = action;

    }

    get response() : USSDResponse {
        return this.action()
    }

    validForSequence(sequence: number, inputValue?: string ): boolean{
        console.log('state data' , this.stateData, typeof(this.stateData), inputValue)
        if (this.stateData){
            console.log('valid for sequence1', this.SequenceIds.includes(sequence) && this.stateData === inputValue);
            return this.SequenceIds.includes(sequence) && this.stateData === inputValue //Match  valid sequence IDs and stateData (compare with user input)
        }else{
            console.log('valid for sequence', this.SequenceIds.includes(sequence));
            return this.SequenceIds.includes(sequence) // Match only valid sequence IDs

        }
    }

    
}