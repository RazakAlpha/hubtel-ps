
# Hubtel Programmable Service (Hubte-ps)

hubtel-ps is library for communicating with the Programmable Services API gateway.
It simplify the process for connecting your application to your users who are using USSD, the Hubtel App, Hubtel Mall, and Hubtel Point Of Sales (POS) Apps.


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
        ()=>{ // action function. main code to execute and return responds HUBTEL API
            return new hps.USSDResponse({
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

### Initialising with factor i.e. portal username and password
```javascript
const nestsms = require('nestsms')

nestsms.init(
  {host: 'https://api.sms.nestitservices.com', 
  version: 'v4', 
  resources: '/messages/send', 
  authModel: {type: 'factor', username: '...', password: '...'} 
})

```

### Processing Request
```javascript
router.post("/", function (req, res, next) {

    //Create hpsRequest from body
    const ussdrequest = new hps.UssdRequest(req.body);

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



## License

[MIT](https://choosealicense.com/licenses/mit/)


## Authors

- [@RazakAlpah](https://github.com/RazakAlpha)

