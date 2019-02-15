Building an automated pipeline

Receive new data and parse.
- helper scripts to fill out all info for data
-- Author, Title, list, list year
-- Search amazon to get image/normal referral link
-- using normal referral link, get genres and publish date

-- update filter options given data
--- store mongoose
--- front end can get options and dynamically change filters to data.

Interface for viewing data
Filter tools

TODO:
- dynamically change filter options based on current selection
-- Some lists don't require a pick year option.
-- Ex: Oprah's book club (just a pure list of books)

- Revamp filters
-- List (by person, org, etc.)
--- Filter template (year, name)
---- If all are years, then filter is year, add "all years", add ascending/descending
---- If mixed, only ability to click through names of lists


Why I want to complete this project
- Skills in handling data, parsing.
- automated processes
- Generalized flow could be used on a variety of projects. Can sell on Flippa possibly


Flow (Build a clean interface between components)

Multiple scraping scripts to handle raw data in different formats. Get data into standardized format
- Obama.py format: "Book Title" by author and author... ->
- scrape.py: Wikipedia book tables specifically NY Times. Can be generalized

Connect to an API to fill out the rest of the info for each entry
- Both of these are specific for books.
	- AmazonAPI.py (Temporary solution that manually gets info)
	- AmazonGenre.py Goes to page for book and scrapes catagories (genres) and publish data


Given parameters, programatically generate an interface to filter and explore dataset
- TODO: need to build V0.1 of this still

TODO:
- filter interface is broken
- not working for all cases.
- interesting case breaking when specific genre, specific year switch to all year.
- Switch to different list, breaks

Process to update books lists:
- call "/writeData" on the backend.
- run python cleanDatabaseScripts with filter function
	to get json.
- add json to node.js/express backend.




Files:

Scrape.py
- Scraper for getting wikipedia book tables for NY bestsellers.
- Two programs in file
1. scrape tables for bestsellers (all years) and write to JSON
2. Add each book (list year, list, title, author), to google doc

Obama.py
- Plaintext scraper
- goes through each line 1 by 1
- gets title from within quotations
- gets authors by looking for any text after "by "
- Add each book (list year, list, title, author), to google doc

AmazonAPI.py
- Finds books without amazon image/normal links
- takes title and author from google doc. Writes amazon image/normal link to google doc.

AmazonGenre.py
- For books with amazon normal link, scraps genre and publication date (if possible) from the amazon website.

cleanDatabaseScripts.py
- creates a nested object of possible genres given list and year.
- JSON outputted object can be used to dynamically change filter options.
- Add to variable in index.js
- CRITICAL for programatic filter interface.
