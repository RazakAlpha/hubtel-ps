import { ResponseTypes } from "../utilities";
import { Request } from "./ussdRequest";
import { Response } from "./ussdResponse";

type HandlerFunction = (arg?: Request) => Response;

export interface ISequenceHandler {
    SequenceIds: number[];
    stateData?: string | string[];
    action: Function

}

export class SequenceHandler implements ISequenceHandler {
    SequenceIds: number[];
    stateData?: string | string[];
    action: HandlerFunction;
    
    private _ussdRequest!: Request;

    constructor(SequenceIds: number[], stateData: string | undefined, action: HandlerFunction) {
        this.SequenceIds = SequenceIds;
        if(Array.isArray(stateData)){
            this.stateData = stateData.map(el =>  String(el))
        }else if(stateData){
            this.stateData = String(stateData);
        }else{
            this.stateData =  undefined;
        }
        // this.Type = Type;
        this.action = action;

    }

    get  response() : Response {
        return  this.action(this.ussdRequest);
    }

    set ussdRequest(request: Request){
        this._ussdRequest = request;
        // this.action.arguments = this._ussdRequest;
    }

    
    public get ussdRequest() : Request {
        return this._ussdRequest;
    }
    

    validForSequence(sequence: number, inputValue: string ): boolean{
        // console.log('state data' , this.stateData, typeof(this.stateData), inputValue)
        if (this.stateData && Array.isArray(this.stateData) && inputValue){
            // console.log('valid for sequence1', this.SequenceIds.includes(sequence) && this.stateData === inputValue);
            return this.SequenceIds.includes(sequence) && this.stateData.includes(inputValue) //Match  valid sequence IDs and stateData (compare with user input)

        } else if(this.stateData && inputValue){
            return this.SequenceIds.includes(sequence) && this.stateData === inputValue //Match  valid sequence IDs and stateData (compare with user input)
        }else{
            // console.log('valid for sequence', this.SequenceIds.includes(sequence));
            return this.SequenceIds.includes(sequence) // Match only valid sequence IDs

        }
    }

    
}