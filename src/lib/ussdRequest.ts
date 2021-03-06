import { ResponseTypes } from "../utilities";

export interface IRequest {
    Type: ResponseTypes;
    Message: string;
    ServiceCode: string;
    Operator: string;
    ClientState: string;
    Mobile: number;
    SessionId: string;
    Sequence: number;
    Platform: string;

}

export class Request  {
    Type: ResponseTypes = ResponseTypes.response;
    Message: string = '';
    ServiceCode: string = '';
    Operator: string  = '';
    ClientState: string  = '';
    Mobile: number  ;
    SessionId: string  = '';
    Sequence: Number;
    Platform: string  = '';

    constructor(request: IRequest) {
        this.Type = request.Type;
        this.Message = request.Message;
        this.ServiceCode = request.ServiceCode;
        this.Operator = request.Operator;
        this.ClientState  = request.ClientState;
        this.Mobile = request.Mobile;
        this.SessionId = request.SessionId;
        this.Sequence = request.Sequence;
        this.Platform = request.Platform;

    }

}