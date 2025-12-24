#import "@preview/invoice-pro:0.1.0": *

#let articles = json.decode("[{\"name\":\"\",\"price\":0}]")
#let company = json.decode("{\"id\":\"2d7dc093-8b20-4f73-a364-08232878bb5e\",\"name\":\"leoj.de\",\"userId\":\"7rYZVseijusOXugfU94ZJJsK1Qlzr7wK\",\"phone\":\"+49 1525 360 4211\",\"country\":\"Germany\",\"state\":\"Bavaria\",\"city\":\"Garching bei München\",\"street\":\"Heisenbergstr 7\",\"streetExtra\":\"\",\"zip\":\"85748\",\"smallBusiness\":true,\"bankName\":\"DKB\",\"bankIban\":\"DE38120300001201964861\",\"bankBic\":\"BYLADEM1001\",\"representative\":\"Leopold Jofer\",\"taxNumber\":\"97028452316\",\"customerNumberCounter\":1,\"invoiceNumberCounter\":0}")
#let customer = json.decode("{\"id\":\"7ef57610-7d49-4541-afae-68b316f8ae3d\",\"customerNumber\":0,\"name\":\"CCI-LEGAL\",\"representative\":\"\",\"email\":\"rjofer@web.de\",\"phone\":\"\",\"notes\":\"\",\"userId\":\"7rYZVseijusOXugfU94ZJJsK1Qlzr7wK\",\"invoiceName\":\"\",\"invoiceCountry\":\"Germany\",\"invoiceState\":\"Bavaria\",\"invoiceCity\":\"Munich\",\"invoiceStreet\":\"Sophienstraße 1\",\"invoicePhone\":\"\",\"invoiceStreetExtra\":\"\",\"invoiceZip\":\"80333\"}")
#let nr = json.decode(0)
#let date = datetime(..json.decode("{\"year\":2025,\"month\":12,\"day\":25}"))



#set text(lang: "de") 

#show: invoice.with(
format: "DIN-5008-A",

sender: (
name: company.name,
address: company.street + company.streetExtra,
city: company.city,
extra: (
  "Tel": [#company.phone],
)
),

recipient: (
name: customer.name,
address: customer.invoiceStreet + customer.invoiceStreetExtra,
city: customer.invoiceZip + " " + customer.invoiceCity
),

invoice-nr: nr,
date: date,
tax-nr: company.taxNumber,
vat-exempt-small-biz: company.smallBusiness,
)


#invoice-line-items(
    ..articles.map(it => item([#it.name], price: it.price))
)

#payment-goal(days: 30)

// Bank Details with QR Code
#bank-details(
    bank: company.bankName,
    iban: company.bankIban,
    bic: company.bankBic,
)

#signature(signature: block[#(company.representative || company.name)])