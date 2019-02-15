import requests
from bs4 import BeautifulSoup
import json
from pprint import pprint
import time

import re

import gspread
from oauth2client.service_account import ServiceAccountCredentials

def addToDoc():
    with open('GoodReadsChoiceAwards.json') as outfile:
        data = json.loads(outfile)
        years = data.keys()
        for year in years:
            for genre in year.keys():
                bookList = genre["books"]
                for book in bookList:
                    print(book[0],book[1])


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
