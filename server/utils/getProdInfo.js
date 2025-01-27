import fs from "fs";
import puppeteer from "puppeteer";

const getProdInfo = async ({ barcode }) => {
  const filePath = "data.json";

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  try {
    const url = `https://go-upc.com/search?q=${barcode}`;
    await page.goto(url, { waitUntil: "networkidle2" });

    const productName = await page.$eval(
      ".product-details .product-name",
      (el) => el.textContent.trim()
    );

    const productImage = await page.$eval(".product-image img", (img) => ({
      src: img.src,
      alt: img.alt,
    }));

    const tableData = await page.$$eval(".table-striped tbody tr", (rows) =>
      rows.map((row) =>
        Array.from(row.querySelectorAll("td")).map((td) =>
          td.textContent.trim()
        )
      )
    );

    const div4Data = await page.$eval(
      ".left-column > div:nth-of-type(2)",
      (div) => ({
        heading: div.querySelector("h2")?.textContent.trim(),
        span: div.querySelector("span")?.textContent.trim(),
      })
    );

    const div5Data = await page.$eval(
      ".left-column > div:nth-of-type(3)",
      (div) => {
        const heading = div.querySelector("h2")?.textContent.trim();
        const ul = div.querySelector("h2 + ul");

        if (ul) {
          const listItems = Array.from(ul.querySelectorAll("li")).map((li) => {
            const key = li.querySelector("span")?.textContent.trim() || null;
            const value = Array.from(li.childNodes)
              .filter((node) => node.nodeType === Node.TEXT_NODE)
              .map((node) => node.textContent.trim())
              .join(" ");
            return { key, value };
          });

          return { heading, type: "list", items: listItems };
        } else {
          const span = div.querySelector("h2 + span")?.textContent.trim();
          return { heading, type: "span", span };
        }
      }
    );

    const productDetails = {
      productName,
      productImage,
      tableData,
      div4: div4Data,
      div5: div5Data,
    };

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
