import puppeteer, { Browser } from "puppeteer";

export const scrapeAmazon = async (productName) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  console.log("Opening Amazon...");
  //   await page.goto("https://www.amazon.in/", { waitUntil: "networkidle2" });

  //   console.log("Typing product name...");
  //   await page.waitForSelector(".nav-input.nav-progressive-attribute");
  //   await page.type(".nav-input.nav-progressive-attribute", productName);

  //   console.log("Clicking search button...");
  //   await page.click("#nav-search-submit-button");

  //   console.log("Waiting for search results...");

  //   console.log("Current Page URL:", page.url());

  // --------------------
  await page.goto(
    `https://www.amazon.in/s?k=${encodeURIComponent(productName)}`,
    {
      waitUntil: "networkidle2",
    }
  );

  await page.waitForSelector(".s-main-slot", { timeout: 10000 });
  //   ----------------------------------

  console.log("Taking screenshot...");
  //   await page.waitForTimeout(5000);
  await page.screenshot({ path: "amazon_search_result.png", fullPage: true });

  console.log("Extracting products...");
  const products = await page.evaluate(() => {
    const items = document.querySelectorAll(
      "#a-page #search .s-result-item .s-card-container"
    );
    const results = [];

    items.forEach((item, index) => {
      if (index >= 8) return;

      const productName =
        item.querySelector(".s-title-instructions-style .a-link-normal h2 span")
          ?.innerText || "N/A";
      const productLink = item.querySelector(".a-link-normal")?.href || "N/A";
      const productImage =
        item.querySelector(".s-image-square-aspect img")?.src || "N/A";
      const rating =
        item.querySelector(".a-spacing-top-micro .a-icon-alt")?.innerText ||
        "N/A";
      const currentPrice =
        item.querySelector(".s-price-instructions-style .a-price .a-offscreen")
          ?.innerText || "N/A";
      const actualPrice =
        item.querySelector(
          ".s-price-instructions-style .aok-inline-block .a-price .a-offscreen"
        )?.innerText || "N/A";

      if (
        productName === "N/A" &&
        productImage === "N/A" &&
        rating === "N/A" &&
        currentPrice === "N/A" &&
        actualPrice === "N/A"
      ) {
        console.log("No product found for the given product name.");
      } else {
        results.push({
          actualName: productName,
          productImage: productImage,
          productLink: productLink,
          rating: rating,
          currentPrice: currentPrice,
          actualPrice: actualPrice,
        });
      }
    });

    return results;
  });
  //   Browser.close();
  return products;
};

// Function to scrape Flipkart
export const scrapeFlipkart = async (productName) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // console.log("Opening Flipkart...");
  await page.goto(
    `https://www.flipkart.com/search?q=${encodeURIComponent(
      productName
    )}&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=on&as=off&sort=price_asc`,
    { waitUntil: "networkidle2" }
  );

  const products = await page.evaluate(() => {
    const productRows = document.querySelectorAll("._75nlfW");
    let productList = [];
    let maxProducts = 8;

    productRows.forEach((row) => {
      const productCards = row.querySelectorAll(".slAVV4");

      productCards.forEach((card) => {
        if (productList.length >= maxProducts) return;

        const productAnchor = card.querySelector(".VJA3rP");
        const productLink = productAnchor
          ? `https://www.flipkart.com${productAnchor.getAttribute("href")}`
          : null;

        const imgTag = productAnchor?.querySelector(".DByuf4");
        const productImage = imgTag ? imgTag.getAttribute("src") : null;

        const nameAnchor = card.querySelector(".wjcEIp");
        const actualName = nameAnchor ? nameAnchor.innerText.trim() : null;

        // Extract rating
        const ratingSpan = card.querySelector(".XQDdHH");
        const rating = ratingSpan ? ratingSpan.innerText.trim() : null;

        // Extract prices
        const priceDiv = card.querySelector(".Nx9bqj");
        const currentPrice = priceDiv ? priceDiv.innerText.trim() : null;

        const actualPriceDiv = card.querySelector(".yRaY8j");
        const actualPrice = actualPriceDiv
          ? actualPriceDiv.innerText.trim()
          : null;

        if (actualName && productLink) {
          productList.push({
            actualName,
            productImage,
            productLink,
            rating,
            currentPrice,
            actualPrice,
          });
        }
      });
    });

    return productList;
  });

  await browser.close();
  return products.slice(0, 8);
};

// Function to scrape Tata 1mg
async function scrapeTata1mg(productName) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(
    `https://www.1mg.com/search/all?name=${encodeURIComponent(productName)}`
  );

  await page.waitForSelector(".style__container___3xtzj");

  const product = await page.evaluate(() => {
    const item = document.querySelector(".style__container___3xtzj");
    if (!item) return null;
    return {
      actualName:
        item.querySelector(".style__pro-title___3G3rr")?.innerText || "N/A",
      description:
        item.querySelector(".style__pack-size___2JDi6")?.innerText || "N/A",
      price:
        item.querySelector(".style__price-tag___KzOkY")?.innerText || "N/A",
      info: item.querySelector(".style__quantity___2sd1W")?.innerText || "N/A",
    };
  });

  await browser.close();
  return product;
}

// Function to scrape Apollo Pharmacy
async function scrapeApolloPharmacy(productName) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(
    `https://www.apollopharmacy.in/search-medicines/${encodeURIComponent(
      productName
    )}`
  );

  await page.waitForSelector(".ProductCard_product-box__l2R0X");

  const product = await page.evaluate(() => {
    const item = document.querySelector(".ProductCard_product-box__l2R0X");
    if (!item) return null;
    return {
      actualName:
        item.querySelector(".ProductCard_product-name__f82ac")?.innerText ||
        "N/A",
      description:
        item.querySelector(".ProductCard_product-subtext__25bMm")?.innerText ||
        "N/A",
      price:
        item.querySelector(".ProductCard_price__3-8q9")?.innerText || "N/A",
      info: "N/A", // Apollo Pharmacy might not have separate product info
    };
  });

  await browser.close();
  return product;
}
