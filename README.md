
# Hubtel Programmable Service (Hubte-ps)

hubtel-ps is library for communicating with the Programmable Services API gateway.
It simplify the process for connecting your application to your users who are using USSD, the Hubtel App, Hubtel Mall, and Hubtel Point Of Sales (POS) Apps.


## Concept
Hubtel-ps creates an easy to use abstraction layer for communicating with hubtel programmable services for USSD,MOBILE AND POS.
Hubtel-ps allows you to define all your responses or request handlers with descriptors whichi allows it to automatically filters for 
the best response for any request received.

So you only setup your handlers or responses and Hubtel-ps handles the rest
## Features

- Automatically filters Multiple responses for correct response to use
- Saves all session data including user inputs using Lokijs
- Allows retrieval of user input values at any sequence of choice using ClientState value as Key
- Automatically cleans up all stored session data using an interval


## Usage/Examples
### Initialising hps and hpsEngine
```javascript
const hps = require('hubtel-ps');
const hpsEngine = hps.init();
```

### Defining a single request handler
```javascript
    hpsEngine.addHandler(new hps.SequenceHandler(
         [0,1], // valid sequence state, use for filtering type of handler to use
        null, // valid pervious user input. use for filtering handler. NULL means ignore
        (request)=>{ // action function. main code to execute and return responds HUBTEL API
            console.log(request) // the request object to access data such as user input and other data
            return new hps.Response({
                Type: hps.ResponseTypes.response,
                Message: 'Welcome to Naconm. Select Option',
                Label: 'Welcome to Naconm',
                DataType: hps.DataTypes.select,
                FieldType: hps.FieldTypes.number,
                ClientState: 'option',
                Data: [
                    {Display: 'Document Deleivery Request', Value:1},
                    {Display: 'Cancel', Value:2},
                    ],
                })
            }
    ))
```

### Attach multiple handlers or request respones at once via addHandlers()
```javascript
const hps = require('hubtel-ps');
const hpsHandlers = [];

// Home 
hpsHandlers.push(
    new hps.SequenceHandler(
        [0,1], // valid sequence state, use for filtering type of handler to use
        null, // valid pervious user input. use for filtering handler. NULL means ignore
        (request)=>{ // action function. main code to execute and return responds HUBTEL API
            console.log(request) // the request object to access data such as user input and other data
            return new hps.Response({
                Type: hps.ResponseTypes.response,
                Message: 'Welcome to Naconm. Select Option',
                Label: 'Welcome to Naconm',
                DataType: hps.DataTypes.select,
                FieldType: hps.FieldTypes.number,
                ClientState: 'option',
                Data: [
                    {Display: 'Document Deleivery Request', Value:1},
                    {Display: 'Cancel', Value:2},
                    ],
                })
            }
    )
);


// Select Region
hpsHandlers.push(
    new hps.SequenceHandler(
        [2], // valid sequance state where this handler can be used. you can provide multiple sequences
        1, // Valid user input before this handler or response can be applied
        (request)=>{
        return new hps.Response({
            Type: hps.ResponseTypes.response,
            Message: 'Enter Delivery Region',
            DataType: hps.DataTypes.input,
            FieldType: hps.FieldTypes.text,
            ClientState: 'region' // Used as the key for storing the user input or response to this
        })
    }
    )
);

....

// Now Attach hpsHandlers array to the hps Engine;
// this makes all handlers in array directly accessible to the hpsEngine for filtering
hpsEngine.addHandlers(hpsHandlers);


```

### Processing Request
```javascript
router.post("/", function (req, res, next) {

    //Create hpsRequest from body
    const ussdrequest = new hps.Request(req.body);

    //process the request and produce appropraite response
    return hpsEngine.process(ussdrequest).then(response => {
        // console.log({response});
        return res.json(response);
    }).catch(err => {
        // return res.status(500).json({
        // "Type": "Release",
        // "Message": "End of Route",
        // "ClientState": "2017-03-30",
        // "MaskNextRoute": true
    });
    });
```

### Processing Payment Callback and Fulfillment Request
```javascript
router.post("/complete", function (req, res, next) {
    return hpsEngine.processPayment(req.body, async(paymentRequest)=> {


        //Get session Data stored with lokiJs
        // const sessionData = hps.getSessionData(paymentRequest.SessionId);


        // Implement any custom function or database operation
        // const student = await Student.findOne({schoolcode:'naconm01', indexnumber: sessionData.indexnumber});
        // if(!student){
        // return {ServiceStatus: hps.ServiceStatus.failed, ExtraData:{message: 'student not found'}}
        // }


        // Commit data to database of perform custom operation with successfull payment
        // const delivery = new TranscriptDelivery(paymentRequest);
        // delivery.User = student.user;
        // delivery.Student = student._id;
        // delivery.Indexnumber = student.indexnumber;
        // delivery.Name = student.surname  + ' ' + student.othernames;
        // await delivery.save();

        // Return ServiceStatus to confirm succesful completion of service
        return {ServiceStatus: hps.ServiceStatus.successs, ExtraData:{}}

        // Return failed or Unknown if service completion fialed from your point
        return {ServiceStatus: hps.ServiceStatus.failed, ExtraData:{}}


    }).then(response => {
        // console.log({response});
        return res.json(response); // return fulfillment response automatically
    }).catch(err => {
        console.log({err})
        return res.status(500).json({
        "Type": "Release",
        "Message": "End of Route",
        "MaskNextRoute": true
    });
    });
});
```



## License

[MIT](https://choosealicense.com/licenses/mit/)


## Authors

- [@RazakAlpah](https://github.com/RazakAlpha)

