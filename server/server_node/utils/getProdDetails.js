import fs from "fs";
import puppeteer from "puppeteer";

const getProdDetails = async ({ barcode }) => {
  const filePath = "data.json";

  console.log("he;;o", barcode);
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  try {
    const url = `https://www.gs1.org/services/verified-by-gs1/results?gtin=${barcode}`;
    await page.goto(url, { waitUntil: "networkidle2" });

    // Accept cookies
    try {
      await page.waitForSelector("#onetrust-accept-btn-handler", {
        visible: true,
        timeout: 5000,
      });
      await page.evaluate(() => {
        const btn = document.querySelector("#onetrust-accept-btn-handler");
        if (btn) {
          btn.click();
        }
      });
    } catch {
      console.log("Cookie acceptance button not found.");
    }

    try {
      await page.waitForSelector(".btn-accept", {
        visible: true,
        timeout: 5000,
      });
      await page.evaluate(() => {
        const btn = document.querySelector(".btn-accept");
        if (btn) {
          btn.click();
        }
      });
    } catch {
      console.log("Second acceptance button not found.");
    }

    // Wait for the main product details section
    await page.waitForSelector(".row.mb-spacer-2", {
      visible: true,
      timeout: 5000,
    });

    // Extract product details
    const content = await page.evaluate(() => {
      const data = {};

      const heading = document
        .querySelector(".row.mb-spacer-2 h3")
        ?.innerText.trim();
      data.heading = heading;

      const img = document
        .querySelector(".row.mb-spacer-2 .product-image img")
        ?.src.trim();
      data.img = img;

      const rows = document.querySelectorAll(".company tbody tr");
      rows.forEach((row) => {
        const key = row.querySelector("td:first-child")?.innerText.trim();
        if (key === "Product image URL") {
          const values = [];
          const strongText = row.querySelector("td strong")?.innerText.trim();
          const linkHref = row.querySelector("td a")?.href.trim();
          if (strongText) values.push(strongText);
          if (linkHref) values.push(linkHref);
          data[key] = values;
        } else {
          const value = row.querySelector("td strong")?.innerText.trim();
          if (key && value) {
            data[key] = value;
          }
        }
      });

      return data;
    });

    // Save the data to JSON file
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const existingData = JSON.parse(fileContent);

      existingData.push(content);
      fs.writeFileSync(
        filePath,
        JSON.stringify(existingData, null, 2),
        "utf-8"
      );
    } else {
      const newData = [content];
      fs.writeFileSync(filePath, JSON.stringify(newData, null, 2), "utf-8");
    }

    return content; // Return the extracted content
  } catch (err) {
    console.error("Error interacting with the page:", err);
    throw new Error("Failed to scrape product details.");
  } finally {
    await browser.close();
  }
};

export default getProdDetails;
