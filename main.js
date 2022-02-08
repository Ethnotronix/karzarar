const date = new Date().toISOString().split('T')[0]
console.log(date)
document.getElementById('sale-date').value = date
document.getElementById('sale-date').max = date
document.getElementById('buy-date').max = date
