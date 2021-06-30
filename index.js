// Author	: @bangsyir | bangsyir@gmail.com
// Org 		: Nidobee  
const express = require('express')
const app = express()
const path = require('path')
const request = require('request')
const bodyParser = require('body-parser')
const crypto = require('crypto')
const port = process.env.PORT || 9000
require('dotenv').config()

const jsdom = require('jsdom')
const {JSDOM} = jsdom

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.get('/', (req, res) => {
	const order_number =  Math.random().toString(32).substring(8).toUpperCase()+Date.now()
	res.render('index', {
		pageTitle: 'Nodejs Securepay example',
		order_number: order_number
	})
})

// securepay without banklist
app.post('/securepay-wihtout-banklist', (req, res) => {
	// change with your token from securepay
	const uuid = process.env.SECUREPAY_UUID //|| "9097b595-b77a-4321-94c0-0a6d323b5252"
	const auth = process.env.SECUREPAY_AUTH //|| "f4e4f07afb72a56fc6681d652713522436b50f087306efec39ab7d1be5b8c684"
	const checksum = process.env.SECUREPAY_CHECKSUM // || "5BXhsTmVmRBKkg6xizNB"
	const url = "https://sandbox.securepay.my/api/v1/payments"
	// get data from form
	// const order_number = '20200425132755'
	// const email = 'bangsyir@gmail.com'
	// const buyer_name = 'bangsyir'
	// const phone = '+60176376257'
	// const description = 'Payment for order no 20200425132755'
	// const transaction_amount = '19.90'
	// const callback_url = ''
	// const redirect_url = ''
	// const redirect_post = "true" 
	const order_number = req.body.order_number
	const email = req.body.email
	const buyer_name = req.body.name
	const phone = req.body.phone
	const description = req.body.description
	const transaction_amount = req.body.amount
	const callback_url = req.body.callback_url 
	const redirect_url = req.body.redirect_url
	const redirect_post = "true" 

	  //buyer_email|buyer_name|buyer_phone|callback_url|order_number|product_description|redirect_url|transaction_amount|uid 
	const string = email+"|"+buyer_name+"|"+phone+"|"+callback_url+"|"+order_number+"|"+description+"|"+redirect_url+"|"+transaction_amount+"|"+uuid
	// output
	// bangsyir@gmail.com|bangsyir|60176376257|20200425132755|Payment for order no 20200425132755|19.90|9097b595-b77a-4321-94c0-0a6d323b5252

	const sign = crypto.createHmac('sha256', checksum).update(string).digest('hex')

    request.post({
      method: 'POST',
      url: url,
      form: {
        buyer_name:buyer_name,
        token:auth,
        callback_url:callback_url,
        redirect_url:redirect_url,
        order_number:order_number,
        buyer_email:email,
        buyer_phone:phone,
        transaction_amount:transaction_amount,
        product_description:description,
        redirect_post:redirect_post,
        checksum:sign
      }
    }, function(error, response, body) {
      if(!error && response.statusCode == 200) {
        // jsdom section
        const dom = new JSDOM(`${body}`)
        res.redirect(dom.window.document.forms[0].action)
        // option send DATA to another page
        // res.render('securepay', {
        //   pageTitle: 'Secure Pay',
        //   page_name: 'secure_pay',
        //   paymentForm: body
        // })
      }
    })
})

app.post('/securepay-with-banklist', (req, res) => {
	// change with your token from securepay
	const uuid = process.env.SECUREPAY_UUID //|| "9097b595-b77a-4321-94c0-0a6d323b5252"
	const auth = process.env.SECUREPAY_AUTH //|| "f4e4f07afb72a56fc6681d652713522436b50f087306efec39ab7d1be5b8c684"
	const checksum = process.env.SECUREPAY_CHECKSUM // || "5BXhsTmVmRBKkg6xizNB"
	const url = "https://sandbox.securepay.my/api/v1/payments"
	// get data from form
	// const order_number = '20200425132755'
	// const email = 'bangsyir@gmail.com'
	// const buyer_name = 'bangsyir'
	// const phone = '+60176376257'
	// const description = 'Payment for order no 20200425132755'
	// const transaction_amount = '19.90'
	// const callback_url = ''
	// const redirect_url = ''
	// const buyer_bank_code = ''
	// const redirect_post = "true" 
	const order_number = req.body.order_number
	const email = req.body.email
	const buyer_name = req.body.name
	const phone = req.body.phone
	const description = req.body.description
	const transaction_amount = req.body.amount
	const callback_url = req.body.callback_url 
	const redirect_url = req.body.redirect_url
	const buyer_bank_code = req.body.bank_code
	const redirect_post = "true" 

	  //buyer_email|buyer_name|buyer_phone|callback_url|order_number|product_description|redirect_url|transaction_amount|uid 
	const string = email+"|"+buyer_name+"|"+phone+"|"+callback_url+"|"+order_number+"|"+description+"|"+redirect_url+"|"+transaction_amount+"|"+uuid
	// output
	// bangsyir@gmail.com|bangsyir|60176376257|20200425132755|Payment for order no 20200425132755|19.90|9097b595-b77a-4321-94c0-0a6d323b5252
	
	const sign = crypto.createHmac('sha256', checksum).update(string).digest('hex')

    request.post({
      method: 'POST',
      url: url,
      form: {
        buyer_name:buyer_name,
        token:auth,
        callback_url:callback_url,
        redirect_url:redirect_url,
        order_number:order_number,
        buyer_email:email,
        buyer_phone:phone,
        transaction_amount:transaction_amount,
        product_description:description,
        redirect_post:redirect_post,
        checksum:sign,
        buyer_bank_code:buyer_bank_code
      }
    }, function(error, response, body) {
      if(!error && response.statusCode == 200) {
        // jsdom section
        const dom = new JSDOM(`${body}`)
        res.redirect(dom.window.document.forms[0].action)
        // option send DATA to another page
        // res.render('securepay', {
        //   pageTitle: 'Secure Pay',
        //   page_name: 'secure_pay',
        //   paymentForm: body
        // })
      }
    })
})

app.listen(port, () => {
	console.log(`Server is listening on port ${port}`)
})

