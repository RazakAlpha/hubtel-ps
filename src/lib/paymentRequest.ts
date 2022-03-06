export interface IPaymentCallback {
    OrderId: string;
    SessionId: string;
    ExtraData: any;
    OrderInfo:  IOrderInfo;


}

export interface IOrderInfo {
    CustomerMobileNumber: number;
    CustomerName: string;
    Status: string;
    Currency: string;
    BranchName: string;
    IsRecurring: boolean;
    RecurringInvoiceId: string;
    OrderDate: Date;
    Items: IOrderInfoItems[],
    Payment: IOrderInfoPayment
}

export interface IOrderInfoItems {
    ItemId: string;
    Name: string;
    Quantity: number;
    UnitPrice: number
}
export interface IOrderInfoPayment{
    PaymentType: string;
    PaymentDescription: string;
    IsSucessful: boolean;
    AmountPaid: number;
    PaymentDate: Date
}

export class PaymentCallback implements IPaymentCallback {
    OrderId: string;
    SessionId: string;
    ExtraData: any;
    OrderInfo: IOrderInfo;

    constructor(paymentRequest: IPaymentCallback){
        this.OrderId = paymentRequest.OrderId;
        this.SessionId = paymentRequest.SessionId;
        this.ExtraData = paymentRequest.ExtraData;
        this.OrderInfo = paymentRequest.OrderInfo;
    }

}