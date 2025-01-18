import fs from "fs";
import puppeteer from "puppeteer";

const getProdInfo = async ({ barcode }) => {
  const filePath = "data.json";

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  try {
    const url = `https://go-upc.com/search?q=${barcode}`;
    await page.goto(url, { waitUntil: "networkidle2" });

    // Extract product details
    const productName = await page.$eval(
      ".product-details .product-name",
      (el) => el.textContent.trim()
    );

    // Extract product image details
    const productImage = await page.$eval(".product-image img", (img) => ({
      src: img.src,
      alt: img.alt,
    }));

    // Extract table details
    const tableData = await page.$$eval(".table-striped tbody tr", (rows) =>
      rows.map((row) =>
        Array.from(row.querySelectorAll("td")).map((td) =>
          td.textContent.trim()
        )
      )
    );

    // Extract details from the fourth div
    const div4Data = await page.$eval(
      ".left-column > div:nth-of-type(2)",
      (div) => ({
        heading: div.querySelector("h2")?.textContent.trim(),
        span: div.querySelector("span")?.textContent.trim(),
      })
    );

    // Extract details from the fifth div
    const div5Data = await page.$eval(
      ".left-column > div:nth-of-type(3)",
      (div) => ({
        heading: div.querySelector("h2")?.textContent.trim(),
        span: div.querySelector("span")?.textContent.trim(),
      })
    );

    // Structure data
    const productDetails = {
      productName,
      productImage,
      tableData,
      div4: div4Data,
      div5: div5Data,
    };

    // // Write data to file
    // fs.writeFileSync(filePath, JSON.stringify(productDetails, null, 2));

    // console.log("Data extracted and saved:", productDetails);

    return productDetails;
  } catch (e) {
    console.error("Failed to extract product details:", e);
    return null;
  } finally {
    await browser.close();
  }
};

export default getProdInfo;
// Example usage
// getProdDetails({ barcode: "8904187004481" });
