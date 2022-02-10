const date = new Date().toISOString().split("T")[0];

const buyDateId = getById("buy-date");
const saleDateId = getById("sale-date");
const buttonReset = getById("reset-button");
const buttonCalculate = getById("calculate-button");
const resultContainer = document.querySelector(".result-container");
const resultContainerContext = document.querySelector(".result-container>div");
const calculateContainer = document.querySelector(".calculate-container");
const buyPriceInputContainer = getById("buy-price-container");
const salePriceInputContainer = getById("sale-price-container");

saleDateId.value = date;
saleDateId.max = date;
buyDateId.max = date;

async function getUsdTry(date) {
  const response = await fetch("usdtry.json");
  const data = await response.json();
  return data[date];
}

function dateFormatter(date) {
  return (
    date.split("-")[2] + "." + date.split("-")[1] + "." + date.split("-")[0]
  );
}

function numberFormatter(number) {
  return number.toLocaleString("tr-TR", {
    maximumFractionDigits: 2,
  });
}

async function calculate(buyDate, saleDate, buyPrice, salePrice) {
  const usdBuyDate = Number(await getUsdTry(buyDate));
  const usdSaleDate = Number(await getUsdTry(saleDate));
  if (!usdBuyDate) {
    return `<p class="summary">Alış tarihi için fiyat bilgisi mevcut değil!</p>`;
  }
  if (!usdSaleDate) {
    return `<p class="summary">Satış tarihi için fiyat bilgisi mevcut değil!</p>`;
  }
  const usdBuyPrice = buyPrice / usdBuyDate;
  const usdSalePrice = salePrice / usdSaleDate;
  const result = usdSalePrice - usdBuyPrice;
  let resultText = `<p>
  Ürünü aldığın <span>${dateFormatter(buyDate)}</span> tarihinde dolar kuru
  <span>₺${usdBuyDate.toFixed(2)}</span> seviyesindeydi.<br />
  Alış fiyatın olan <span>₺${numberFormatter(Number(buyPrice))}</span> ile
  <span>$${numberFormatter(Number(usdBuyPrice))}</span> alabilirdin.<br />
  Sattığın <span>${dateFormatter(saleDate)}</span> tarihinde ise dolar kuru
  <span>₺${usdSaleDate.toFixed(2)}</span> seviyesindeydi.<br />
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
    )}</b><small>(15%)</small> kar ettin.
  </p>`;
  } else {
    resultText += `<p class="summary loss">
    Maalesef, yaptığın satıştan <b>$${numberFormatter(
      Math.abs(result)
    )}</b><small>(15%)</small> zarar ettin.
  </p>`;
  }
  return resultText;
}

function getById(id) {
  return document.getElementById(id);
}

buttonReset.addEventListener("click", resetButtonClick);
async function resetButtonClick() {
  resultContainer.style.display = "none";
  calculateContainer.style.display = "block";
  getById("calculate-form").reset();
}
buttonCalculate.addEventListener("click", calculateButtonClick);
async function calculateButtonClick() {
  const buyDate = buyDateId.value;
  const saleDate = saleDateId.value;
  const buyPrice = getById("buy-price").value;
  const salePrice = getById("sale-price").value;
  if (!buyDate || !saleDate || !buyPrice || !salePrice) {
    if (!buyDate) {
      restartAnimate(buyDateId);
    }
    if (!saleDate) {
      restartAnimate(saleDateId);
    }
    if (!buyPrice) {
      restartAnimate(buyPriceInputContainer);
    }
    if (!salePrice) {
      restartAnimate(salePriceInputContainer);
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
}
function restartAnimate(id) {
  id.classList.remove("error");
  setTimeout(function () {
    id.classList.add("error");
  }, 1);
}
