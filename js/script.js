// get all the necessary DOMs.
const form = document.getElementById('form');

const clientName = document.getElementById('client_name');
const eventName = document.getElementById('event_name');
const discription = document.getElementById('discription');
const eventDate = document.getElementById('event_date');
const eventCost = document.getElementById('event_cost');
const firstPay = document.getElementById('first_pay');
const secondPay = document.getElementById('second_pay');
const payment = document.getElementById('payment');
const invoiceContainer = document.getElementById('invoice-container');

const isFullPay = document.getElementById('is_full_pay');

// toggle payment option form.
isFullPay.addEventListener("click", function() {
	if (this.checked) {
		payment.style.display = "block";
	} else {
		payment.style.display = "none";
	}
})

// Handles the data cleaning
function getData() {
	const data = {
		"clientName": (function() {
			// clean client name to be title case.
			try {
				let nameVar = String(clientName.value).split(" ");
				for (let i = 0; i < nameVar.length; i++) {
					nameVar[i] = nameVar[i][0].toUpperCase() + nameVar[i].slice(1); 
					return nameVar.join(" ");
				}
			} catch (e) {
				if (e instanceof TypeError) {
					return ""
				}
			}
		}),
		"eventName": (function() {
			// clean event name to be title case.
			try {
				let nameVar = String(eventName.value).split(" ");
				for (let i = 0; i < nameVar.length; i++) {
					nameVar[i] = nameVar[i][0].toUpperCase() + nameVar[i].slice(1); 
					return nameVar.join(" ");
				}
			} catch (e) {
				if (e instanceof TypeError) {
					return ""
				}
			}
		}),
		"discription": discription.value,
		"eventDate": eventDate.value,
		"eventCost": Number(eventCost.value),
		"date": new Date().toLocaleDateString(),
		"firstPayment": firstPay.value,
		"secondPayment": secondPay.value,
		"vatFor5Percent": (function() {
			return Number((5 / 100) * this.eventCost).toFixed(2);
		}),
		"vatFor75Percent": (function() {
			return Number((7.5 / 100) * this.eventCost).toFixed(2);
		}),
		"totalWith5PercentVat": (function() {
			return (Number(this.eventCost) + Number(this.vatFor5Percent())).toFixed(2);
		}),
		"totalWith75PercentVat": (function() {
			return (Number(this.eventCost) + Number(this.vatFor75Percent())).toFixed(2);
		}),
		"invoiceNo": (function() {
			let invoiceNum = "";
			let alph = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
			let randNum = Math.floor(Math.random() * (999999999999 - 100000000000) + 100000000000)

			for (let i = 0; i < 3; i++) {
				invoiceNum += alph[Math.floor(Math.random() * (alph.length))];
			}

			return invoiceNum + randNum;
		}),
	}

	// the final cleaned data
	let payload = {
		"sheet1": {
			"date": data.date,
			"eventDate": data.eventDate,
			"eventName": data.eventName(),
			"discription": data.discription,
			"clientName": data.clientName(),
			"eventCost": data.eventCost,
			"firstPayment": data.firstPayment,
			"secondPayment": data.secondPayment,
			"invoiceNo": data.invoiceNo(),
			"vatFor5Percent": data.vatFor5Percent(),
			"vatFor75Percent": data.vatFor75Percent(),
			"totalWith5PercentVat": data.totalWith5PercentVat(),
			"totalWith75PercentVat": data.totalWith75PercentVat(),
		}
	  };

	return payload;
}


// console.log(data.VAT())
// console.log(data.invoiceNo())

// handles the submition
form.addEventListener("submit", function(e) {
	e.preventDefault();
	const data = JSON.stringify(getData());
	// console.log(data);
	// console.log("Incdc", invoiceContainer);
	invoiceContainer.style.display = "flex";
	invoiceContainer.innerHTML = `
												<div>
													<img src="img/loader.gif" alt="" />
												</div>
											`;
	handleRequest("POST", data);
	form.reset();
  })

// request obj
const xhr = new XMLHttpRequest();


// handles the request
function handleRequest(method, data) {
	const url = "https://api.sheety.co/2620d6b350ebd0c7460aef489947c6a6/2022ScheduleSalesInvoice/sheet1/";

	xhr.open(method, url, true);

	xhr.onprogress = function() {
		invoiceContainer.style.display = "flex";
	}

	xhr.onload = function() {
		if (xhr.status === 200) {
			let currentdate = new Date();
			// let hour = currentdate.getHours() == 0 ? 12 : currentdate.getHours()
			// let datetime = `${currentdate.getDate()}/${currentdate.getMonth()+1}/${currentdate.getFullYear()} ${currentdate.getMinutes()}`;
			const data = JSON.parse(xhr.responseText);
			// console.log(data)
			// console.log(JSON.parse(data))
			invoiceContainer.style.display = "flex";
			invoiceContainer.innerHTML = `
													<div id="invoice-wrapper" class="invoice-wrapper">
													<div class="inner-logo">
														<span id="print">
															<a id="print-link" href="invoice-wrapper">print</a>
														</span>
														<span id="close">&cross;</span>
														<img src="img/logo.png" alt="logo">
													</div>
													<hr>
													<h2>INVOICE</h2>
													<div class="invoice-content">
														<table>
															<tr>
																<th>Invoice ID: </th>
																<td>${data.sheet1.invoiceNo}</td>
															</tr>
															<tr>
																<th>Client Name: </th>
																<td>${data.sheet1.clientName}</td>
															</tr>
															<tr>
																<th>Name of Event: </th>
																<td>${data.sheet1.eventName}</td>
															</tr>
															<tr>
																<th>Event Date: </th>
																<td>${(data.sheet1.eventDate == null || data.sheet1.eventDate == "") ? "None" : data.sheet1.eventDate}</td>
															</tr>
															<tr>
																<th>Cost of Event: </th>
																<td>${data.sheet1.eventCost}</td>
															</tr>
															<tr>
																<th>First Payment: </th>
																<td>${(data.sheet1.firstPayment == null || data.sheet1.firstPayment == "") ? "None" : data.sheet1.firstPayment}</td>
															</tr>
															<tr>
																<th>Second Payment: </th>
																<td>${data.sheet1.secondPayment == null || data.sheet1.secondPayment == "" ? "None" : data.sheet1.secondPayment}</td>
															</tr>
															<tr>
																<th>VAT: </th>
																<td>${data.sheet1.vatFor75Percent}</td>
															</tr>
															<tr>
																<th>Total Amount: </th>
																<td>${data.sheet1.totalWith75PercentVat}</td>
															</tr>
														</table>
													</div>
												</div>
													`;
		}

		if (invoiceContainer.style.display == "flex") {
			document.getElementById("close").addEventListener("click", function() {
				invoiceContainer.style.display = "none";
			})
			document.getElementById("print-link").addEventListener("click", function(e) {
				e.preventDefault();
				window.print();
			})
		}

	};

	// Make the API call to sheety
	if (method == "POST") {
		if (data) {
			xhr.setRequestHeader("Accept", "application/json");
			xhr.setRequestHeader("Content-Type", "application/json");
			xhr.send(data);
		}
	} else if (method == "GET") {
		xhr.send();
	}
	
}
