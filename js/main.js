// helper functions

function getById(id) {
  return document.getElementById(id);
}

function dateFormatter(date) {
  return (
    // reverse date
    date.split("-").reverse().join(".")
  );
}

function numberFormatter(number) {
  return number.toLocaleString("tr-TR", {
    maximumFractionDigits: 2,
  });
}
// startAnimate function can replay animate
function startAnimate(id) {
  id.classList.remove("error");
  setTimeout(function () {
    id.classList.add("error");
  }, 1);
}

const date = new Date().toISOString().split("T")[0];

const buttonReset = getById("reset-button");
const buttonCalculate = getById("calculate-button");
const resultContainer = document.querySelector(".result-container");
const resultContainerContext = document.querySelector(".result-container>div");
const calculateContainer = document.querySelector(".calculate-container");
const buyPriceInputContainer = getById("buy-price-container");
const salePriceInputContainer = getById("sale-price-container");

const inputIds = {
  buyDate: getById("buy-date"),
  saleDate: getById("sale-date"),
  buyPrice: getById("buy-price"),
  salePrice: getById("sale-price")
}

inputIds.saleDate.value = date;
inputIds.saleDate.max = date;
inputIds.buyDate.max = date;

async function getUsdTry(buyDate, saleDate) {
  const response = await fetch("usdtry.json");
  const data = await response.json();
  return { 
    buy: Number(data[buyDate]),
    sale: Number(data[saleDate])
  }
}

async function calculate(buyDate, saleDate, buyPrice, salePrice) {
  const usdTry = await getUsdTry(buyDate, saleDate);
  if (!usdTry.buy) {
    return `<p class="summary">Alış tarihi için fiyat bilgisi mevcut değil!</p>`;
  }
  if (!usdTry.sale) {
    return `<p class="summary">Satış tarihi için fiyat bilgisi mevcut değil!</p>`;
  }
  const usdBuyPrice = buyPrice / usdTry.buy;
  const usdSalePrice = salePrice / usdTry.sale;
  const result = usdSalePrice - usdBuyPrice;
  const percentage = (Math.abs(result) / usdBuyPrice) * 100;
  let resultText = `<p>
  Ürünü aldığın <span>${dateFormatter(buyDate)}</span> tarihinde dolar kuru
  <span>₺${numberFormatter(usdTry.buy)}</span> seviyesindeydi.<br />
  Alış fiyatın olan <span>₺${numberFormatter(Number(buyPrice))}</span> ile
  <span>$${numberFormatter(Number(usdBuyPrice))}</span> alabilirdin.<br />
  Sattığın <span>${dateFormatter(saleDate)}</span> tarihinde ise dolar kuru
  <span>₺${numberFormatter(usdTry.sale)}</span> seviyesindeydi.<br />
   Satış fiyatın olan <span>₺${numberFormatter(
     Number(salePrice)
   )}</span> ile <span>$${numberFormatter(
    Number(usdSalePrice)
  )}</span> alabilirdin.
  </p>`;

  if (result === 0) {
    resultText += `<p class="summary equal">
    Ne kar ettik ne zarar ettik.
  </p>`;
  } else if (result > 0) {
    resultText += `<p class="summary profit">
    Tebrikler, yaptığın satıştan <b>$${numberFormatter(
      result
    )}</b><small>(%${percentage.toFixed(2)})</small> kar ettin.
  </p>`;
  } else {
    resultText += `<p class="summary loss">
    Maalesef, yaptığın satıştan <b>$${numberFormatter(
      Math.abs(result)
    )}</b><small>(%${percentage.toFixed(2)})</small> zarar ettin.
  </p>`;
  }
  return resultText;
}

buttonReset.addEventListener("click", resetButtonClick);
async function resetButtonClick() {
  resultContainer.style.display = "none";
  calculateContainer.style.display = "block";
  getById("calculate-form").reset();
}
buttonCalculate.addEventListener("click", calculateButtonClick);
async function calculateButtonClick() {
  const buyDate = inputIds.buyDate.value;
  const saleDate = inputIds.saleDate.value;
  const buyPrice = getById("buy-price").value;
  const salePrice = getById("sale-price").value;
  if (!buyDate || !saleDate || !buyPrice || !salePrice) {
    if (!buyDate) {
      startAnimate(inputIds.buyDate);
    }
    if (!saleDate) {
      startAnimate(inputIds.saleDate);
    }
    if (!buyPrice) {
      startAnimate(buyPriceInputContainer);
    }
    if (!salePrice) {
      startAnimate(salePriceInputContainer);
    }
    return;
  }
  resultContainer.style.display = "block";
  calculateContainer.style.display = "none";

  resultContainerContext.innerHTML = await calculate(
    buyDate,
    saleDate,
    buyPrice,
    salePrice
  );
  resultContainer.scrollIntoView({ 
    behavior: 'smooth' 
  });
}

