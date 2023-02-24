const request = require('request');
const cheerio = require('cheerio');
const url = require('url');

// Step 1: Accept a Wikipedia link and validate it
const wikiLink = 'https://en.wikipedia.org/wiki/JavaScript';
if (isValidWikiLink(wikiLink)) {
  console.log('This is a valid Wikipedia link.');
  } else {
  console.error('This is not a valid Wikipedia link.');
  }

// Step 2: Accept an integer between 1 to 20
function validateInteger(n) {
  // Convert the input to an integer
  n = parseInt(n);

  // Check if the input is a valid integer between 1 to 20
  if (isNaN(n) || n < 1 || n > 20) {
    console.log("Input is not a valid integer between 1 and 20");
    return null;
  }

  // Return the valid integer
  return n;
}
  
let n = 21; // can be a string or a number
let validInteger = validateInteger(n);
if (validInteger !== null) {
  console.log("Valid integer: " + validInteger);
}


// Step 3-5: Scrape the link and all newly found links for n cycles
const visitedLinks = new Set();
const linksToVisit = new Set([wikiLink]);

for (let i = 0; i < n; i++) {
  const newLinks = new Set();

  // Visit all links in the current set
  for (const link of linksToVisit) {
    if (!visitedLinks.has(link)) {
      visitedLinks.add(link);

      // Scrape the page for new links
      request(link, (err, res, body) => {
        if (err) {
          console.error(`Error scraping ${link}: ${err.message}`);
        } else {
          const $ = cheerio.load(body);

          $('a').each((i, elem) => {
            const href = $(elem).attr('href');
            if (href && isWikiLink(href)) {
              const absoluteUrl = url.resolve(link, href);
              newLinks.add(absoluteUrl);
            }
          });
          console.log("new links: " + newLinks)
        }
      });
    }
  }

  // Update linksToVisit with new links
  linksToVisit.clear();
  for (const link of newLinks) {
    linksToVisit.add(link);
  }
  console.log("wiki new links: " + linksToVisit)

}

/**
 * Checks whether a link is a valid Wikipedia link.
 * @param {string} link - The link to validate.
 * @returns {boolean} - Whether the link is a valid Wikipedia link.
 */
function isValidWikiLink(wikiLink) {
  const regex = /^https?:\/\/([a-z]{2}\.)?wikipedia\.org\/wiki\/.+$/;
  return regex.test(wikiLink);
}

/**
 * Checks whether a link is a Wikipedia link.
 * @param {string} link - The link to check.
 * @returns {boolean} - Whether the link is a Wikipedia link.
 */
function isWikiLink(link) {
  return link.startsWith('/wiki/');
}
