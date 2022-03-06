import { ResponseTypes } from "../utilities";
import { UssdRequest } from "./ussdRequest";
import { USSDResponse } from "./ussdResponse";

type HandlerFunction = (arg?: UssdRequest) => USSDResponse;

export interface ISequenceHandler {
    SequenceIds: number[];
    stateData?: string;
    action: Function

}

export class SequenceHandler implements ISequenceHandler {
    SequenceIds: number[];
    stateData?: string;
    action: HandlerFunction;
    
    private _ussdRequest!: UssdRequest;

    constructor(SequenceIds: number[], stateData: string | undefined, action: HandlerFunction) {
        this.SequenceIds = SequenceIds;
        this.stateData = stateData? String(stateData) : undefined;
        // this.Type = Type;
        this.action = action;

    }

    get  response() : USSDResponse {
        return  this.action(this.ussdRequest);
    }

    set ussdRequest(request: UssdRequest){
        this._ussdRequest = request;
        // this.action.arguments = this._ussdRequest;
    }

    
    public get ussdRequest() : UssdRequest {
        return this._ussdRequest;
    }
    

    validForSequence(sequence: number, inputValue?: string ): boolean{
        // console.log('state data' , this.stateData, typeof(this.stateData), inputValue)
        if (this.stateData){
            // console.log('valid for sequence1', this.SequenceIds.includes(sequence) && this.stateData === inputValue);
            return this.SequenceIds.includes(sequence) && this.stateData === inputValue //Match  valid sequence IDs and stateData (compare with user input)
        }else{
            // console.log('valid for sequence', this.SequenceIds.includes(sequence));
            return this.SequenceIds.includes(sequence) // Match only valid sequence IDs

        }
    }

    
}