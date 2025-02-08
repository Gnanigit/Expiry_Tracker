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
      if (index >= 5) return;

      const productName =
        item.querySelector(".s-title-instructions-style .a-link-normal h2 span")
          ?.innerText || "N/A";
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

      results.push({
        actualName: productName,
        productImage: productImage,
        rating: rating,
        currentPrice: currentPrice,
        actualPrice: actualPrice,
      });
    });

    return results;
  });

  console.log("Extracted Products:", products);
  //   Browser.close();
  return products;
};

// Function to scrape Flipkart
async function scrapeFlipkart(productName) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const primaryUrl = `https://www.flipkart.com/search?q=${encodeURIComponent(
    productName
  )}`;
  const backupUrl = `https://www.flipkart.com/search?q=${encodeURIComponent(
    productName
  )}&otracker=search`;

  try {
    await page.goto(primaryUrl, { waitUntil: "networkidle2", timeout: 10000 });
  } catch (error) {
    console.error(
      `Failed to load primary URL: ${primaryUrl}, trying backup URL...`
    );
    try {
      await page.goto(backupUrl, { waitUntil: "networkidle2", timeout: 10000 });
    } catch (backupError) {
      console.error(`Failed to load backup URL: ${backupUrl}`);
      await browser.close();
      throw new Error("Both primary and backup URLs failed");
    }
  }

  await page.waitForSelector("._1AtVbE", { timeout: 10000 });

  const product = await page.evaluate(() => {
    const item = document.querySelector("._1AtVbE");
    if (!item) return null;
    return {
      actualName: item.querySelector("._4rR01T, .s1Q9rs")?.innerText || "N/A",
      description: item.querySelector(".fMghEO")?.innerText || "N/A",
      price: item.querySelector("._30jeq3")?.innerText || "N/A",
      info: item.querySelector("._3Djpdu")?.innerText || "N/A",
    };
  });

  await browser.close();
  return product;
}

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
