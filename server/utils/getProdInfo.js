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

    // Extract details from the second div
    const div4Data = await page.$eval(
      ".left-column > div:nth-of-type(2)",
      (div) => ({
        heading: div.querySelector("h2")?.textContent.trim(),
        span: div.querySelector("span")?.textContent.trim(),
      })
    );

    // Extract details from the third div
    const div5Data = await page.$eval(
      ".left-column > div:nth-of-type(3)",
      (div) => {
        const heading = div.querySelector("h2")?.textContent.trim();

        // Check if a <ul> exists immediately after <h2>
        const ul = div.querySelector("h2 + ul");

        if (ul) {
          // Extract data from all <li> elements in the <ul>
          const listItems = Array.from(ul.querySelectorAll("li")).map((li) => {
            const key = li.querySelector("span")?.textContent.trim() || null; // Text inside <span>, if it exists
            const value = Array.from(li.childNodes)
              .filter((node) => node.nodeType === Node.TEXT_NODE) // Get direct text nodes (excluding child elements)
              .map((node) => node.textContent.trim()) // Trim the text content
              .join(" "); // Combine if multiple text nodes exist
            return { key, value };
          });

          return { heading, type: "list", items: listItems };
        } else {
          // Fallback: Get <span> immediately after <h2>
          const span = div.querySelector("h2 + span")?.textContent.trim();
          return { heading, type: "span", span };
        }
      }
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
  }
  // finally {
  //   await browser.close();
  // }
};

export default getProdInfo;
// Example usage
// getProdDetails({ barcode: "8904187004481" });
