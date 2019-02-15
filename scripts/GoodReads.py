import requests
from bs4 import BeautifulSoup
import json
from pprint import pprint
import time

import re

import gspread
from oauth2client.service_account import ServiceAccountCredentials

def addToDoc():
    scope = ['https://spreadsheets.google.com/feeds',
     'https://www.googleapis.com/auth/drive']
    creds = ServiceAccountCredentials.from_json_keyfile_name('client_secret.json', scope)
    client = gspread.authorize(creds)

    sheet = client.open("ChangeTheWorld").sheet1

    rateLimit = 0
    start = False

    with open('GoodReadsChoiceAwards.json', 'r') as outfile:
        data = json.load(outfile)
        for year in data:
            print(list(data[year].keys()))
            for genre in list(data[year].keys()):
                bookList = data[year][genre]["books"]
                for book in bookList:
                    if book[0] == "You Don't Have to Say You Love Me":
                        start = True
                    if start:
                        if rateLimit == 50:
                            print("sleeping")
                            time.sleep(101)
                            rateLimit = 0
                        print(year)
                        print(genre)
                        print(book[0])
                        print(book[1])
                        sheet.insert_row([year,book[0], book[1],"Good Reads Booklist","","",genre], 2, "USER_ENTERED")
                        rateLimit += 1

def getBookGenreList(url):
    d = []
    r = requests.get(url)
    r.raise_for_status()
    html = r.text.encode('utf8')
    soup = BeautifulSoup(html, 'html.parser')
    books = soup.find_all("a", {"class": "pollAnswer__bookLink"})
    # pprint(books)
    for book in books:
        d.append(book.find("img")['alt'].split(" by "))
    return d


def getGoodReads():
    data = {}
    rootURL = "https://www.goodreads.com"
    baseURL = "https://www.goodreads.com/choiceawards/best-books-"
    for x in range(2009,2019):
        year = str(x)

        data[year] = {}
        
        url = baseURL + year
        print(url)
        r = requests.get(url)
        r.raise_for_status()
        html = r.text.encode('utf8')
        soup = BeautifulSoup(html, 'html.parser')
        categories = soup.find_all("div", {'id':'categories'})
        genres = categories[0].find_all("a",href=True)
        # pprint(genres)
        for genre in genres:
            link = genre["href"]
            if "/choiceawards" in link:
                g = genre.find("h4", {'class':'category__copy'})
                g = g.get_text().replace("&", "and")
                g = re.findall('\\n([^"]+)\\n', g)[0]

                data[year][g] ={}
                l = rootURL + str(link)

                bookGenreData = getBookGenreList(l)
                # pprint(bookGenreData)

                data[year][g]["link"] = l
                data[year][g]["books"] = bookGenreData
                # print(link)
                # print(g.get_text())
    with open('GoodReadsChoiceAwards.json', 'w') as outfile:
        json.dump(data, outfile)

if __name__ == '__main__':
    # getGoodReads()
    addToDoc()
