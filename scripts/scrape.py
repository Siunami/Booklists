import requests
from bs4 import BeautifulSoup
import json
from pprint import pprint
import time

import gspread
from oauth2client.service_account import ServiceAccountCredentials

def get_requests(url):
    r = requests.get(url)
    r.raise_for_status()
    html = r.text.encode('utf8')
    soup = BeautifulSoup(html, 'html.parser')
    baseURL = "http://www.fortune.com"
    # print (soup.prettify())
    for headline in soup.find_all('div', {"class":"headline"}):
        print(headline.text)
        url = baseURL + headline.find('a')['href']
        get_article_requests(url)

def get_article_requests(url):
    r = requests.get(url)
    r.raise_for_status()
    html = r.text.encode('utf8')
    soup = BeautifulSoup(html, 'html.parser')
    # print (soup.prettify())
    article = soup.find('div', {"id":"article-body"})
    if (type(article) == type(None)):
        print("Not an article")
    else:
        print(article.get_text()) 
    # with open('mypage.html', 'w') as myFile:
    # 	myFile.write(soup)

def getNYBooks():
    baseURL = "https://en.wikipedia.org/wiki/The_New_York_Times_Non-Fiction_Best_Sellers_of_"
    bookData = {}
    for x in range(0,19):
        year = str(2000 + x)
        url = baseURL + year
        print(url)
        r = requests.get(url)
        r.raise_for_status()
        html = r.text.encode('utf8')
        soup = BeautifulSoup(html, 'html.parser')
        yearBooks = []
        currTitles = []
        for el in soup.find_all("tr"):
            elements = el.find_all("td")
            book = {}
            # if len(elements) == 1:
                
            if len(elements) == 4 or len(elements) == 3:
                # print(elements[1].findNext("a").text)
                # print(elements[1].findNext("a").text in currTitles)
                
                if not(elements[1].text in currTitles):
                    yearBooks.append(book)

                    # print(elements[1].text)

                    book["title"] = elements[1].text
                    currTitles.append(elements[1].text)

                    book["authors"] = []
                    print(elements)
                    print("\n")
                    a = elements[2].find_all("a")
                    if len(a) == 0:
                        # Problem. These have a \n at the end
                        book["authors"].append(elements[2].text)
                    else:
                        for author in elements[2].find_all("a"):
                            book["authors"].append(author.text)
        # print(currTitles)
        bookData[year] = yearBooks
    pprint(bookData)
    # with open('NYbook.json', 'w') as outfile:
    #     json.dump(bookData, outfile)

def getNYBooksFiction():
    baseURL = "https://en.wikipedia.org/wiki/The_New_York_Times_Fiction_Best_Sellers_of_"
    bookData = {}
    for x in range(41,100):
        year = str(1900 + x)
        url = baseURL + year
        print(url)
        r = requests.get(url)
        r.raise_for_status()
        html = r.text.encode('utf8')
        soup = BeautifulSoup(html, 'html.parser')
        yearBooks = []
        currTitles = []
        for el in soup.find_all("tr"):
            elements = el.find_all("td")
            book = {}
            # if len(elements) == 1:
                
            if len(elements) == 4 or len(elements) == 3:
                # print(elements[1].findNext("a").text)
                # print(elements[1].findNext("a").text in currTitles)
                
                if not(elements[1].text in currTitles):
                    yearBooks.append(book)

                    # print(elements[1].text)

                    book["title"] = elements[1].text
                    currTitles.append(elements[1].text)

                    book["authors"] = []
                    print(elements)
                    print("\n")
                    a = elements[2].find_all("a")
                    if len(a) == 0:
                        # Problem. These have a \n at the end
                        book["authors"].append(elements[2].text)
                    else:
                        for author in elements[2].find_all("a"):
                            book["authors"].append(author.text)
        # print(currTitles)
        bookData[year] = yearBooks
    for x in range(0,19):
        year = str(2000 + x)
        url = baseURL + year
        print(url)
        r = requests.get(url)
        r.raise_for_status()
        html = r.text.encode('utf8')
        soup = BeautifulSoup(html, 'html.parser')
        yearBooks = []
        currTitles = []
        for el in soup.find_all("tr"):
            elements = el.find_all("td")
            book = {}
            # if len(elements) == 1:
                
            if len(elements) == 4 or len(elements) == 3:
                # print(elements[1].findNext("a").text)
                # print(elements[1].findNext("a").text in currTitles)
                
                if not(elements[1].text in currTitles):
                    yearBooks.append(book)

                    # print(elements[1].text)

                    book["title"] = elements[1].text
                    currTitles.append(elements[1].text)

                    book["authors"] = []
                    print(elements)
                    print("\n")
                    a = elements[2].find_all("a")
                    if len(a) == 0:
                        # Problem. These have a \n at the end
                        book["authors"].append(elements[2].text)
                    else:
                        for author in elements[2].find_all("a"):
                            book["authors"].append(author.text)
        # print(currTitles)
        bookData[year] = yearBooks
    pprint(bookData)
    with open('NYbookFiction.json', 'w') as outfile:
        json.dump(bookData, outfile)


# def getNYBooks():
#     baseURL = "https://en.wikipedia.org/wiki/The_New_York_Times_Non-Fiction_Best_Sellers_of_"
#     bookData = {}
#     for x in range(0,19):
#         year = str(2000 + x)
#         url = baseURL + year
#         print(url)
#         r = requests.get(url)
#         r.raise_for_status()
#         html = r.text.encode('utf8')
#         soup = BeautifulSoup(html, 'html.parser')
#         yearBooks = []
#         currTitles = []
#         for el in soup.find_all("tr"):
#             elements = el.find_all("td")
#             if len(elements) == 4 or len(elements) == 3:
#                 # print(elements[1].findNext("a").text)
#                 # print(elements[1].findNext("a").text in currTitles)
                
#                 if not(elements[1].text in currTitles):
#                     book = {}

#                     # print(elements[1].text)

#                     book["title"] = elements[1].text
#                     currTitles.append(elements[1].text)

#                     book["authors"] = []
#                     print(elements)
#                     print("\n")
#                     a = elements[2].find_all("a")
#                     if len(a) == 0:
#                         # Problem. These have a \n at the end
#                         book["authors"].append(elements[2].text)
#                     else:
#                         for author in elements[2].find_all("a"):
#                             book["authors"].append(author.text)
#                     yearBooks.append(book)
#         # print(currTitles)
#         bookData[year] = yearBooks
#     pprint(bookData)
#     with open('NYbook.json', 'w') as outfile:
#         json.dump(bookData, outfile)

def writeNYBooksFictionGDoc():
    with open('NYbookFiction.json') as f:
        data = json.load(f)
    # pprint(data)
    scope = ['https://spreadsheets.google.com/feeds',
         'https://www.googleapis.com/auth/drive']
    creds = ServiceAccountCredentials.from_json_keyfile_name('client_secret.json', scope)
    client = gspread.authorize(creds)

    sheet = client.open("ChangeTheWorld").sheet1

    # start inserting at row 2. First row is header
    row = 2

# row = ["I'm","inserting","a","row","into","a,","Spreadsheet","with","Python"]
# index = 1
# sheet.insert_row(row, index)
    
    quota = 1
    for x in range(41,100):
        year = str(1900 + x)
        yearArray = data[year]
        print(year)
        for element in yearArray:
            if quota == 50:
                print("Sleeping for quota")
                time.sleep(102)
                quota = 1
            # sheet.update_cell(row, 1, year)
            # sheet.update_cell(row, 2, element["title"])
            if len(element["authors"]) == 0:
                sheet.insert_row([year, element["title"]], row, "USER_ENTERED")
            elif len(element["authors"]) == 1:
                # sheet.update_cell(row, 3, element["authors"][0])
                sheet.insert_row([year, element["title"], element["authors"][0]], row,"USER_ENTERED")
            elif len(element["authors"]) > 1:
                authors = ""
                for x in range(0,len(element["authors"])):
                    if x == (len(element["authors"]) - 1):
                        authors += element["authors"][x]
                    else:
                        authors += element["authors"][x] + " and "
                # sheet.update_cell(row, 3, authors)
                sheet.insert_row([year, element["title"], authors], row,"USER_ENTERED")
            row = row + 1
            print(quota)
            quota += 1
    for x in range(0,19):
        year = str(2000 + x)
        yearArray = data[year]
        print(year)
        for element in yearArray:
            if quota == 50:
                print("Sleeping for quota")
                time.sleep(102)
                quota = 1
            # sheet.update_cell(row, 1, year)
            # sheet.update_cell(row, 2, element["title"])
            if len(element["authors"]) == 0:
                sheet.insert_row([year, element["title"]], row, "USER_ENTERED")
            elif len(element["authors"]) == 1:
                # sheet.update_cell(row, 3, element["authors"][0])
                sheet.insert_row([year, element["title"], element["authors"][0]], row,"USER_ENTERED")
            elif len(element["authors"]) > 1:
                authors = ""
                for x in range(0,len(element["authors"])):
                    if x == (len(element["authors"]) - 1):
                        authors += element["authors"][x]
                    else:
                        authors += element["authors"][x] + " and "
                # sheet.update_cell(row, 3, authors)
                sheet.insert_row([year, element["title"], authors], row,"USER_ENTERED")
            row = row + 1
            print(quota)
            quota += 1

# def writeNYBooksGDoc():
#     with open('NYbook.json') as f:
#         data = json.load(f)
#     # pprint(data)
#     scope = ['https://spreadsheets.google.com/feeds',
#          'https://www.googleapis.com/auth/drive']
#     creds = ServiceAccountCredentials.from_json_keyfile_name('client_secret.json', scope)
#     client = gspread.authorize(creds)

#     sheet = client.open("ChangeTheWorld").sheet1

#     # start inserting at row 2. First row is header
#     row = 2

# # row = ["I'm","inserting","a","row","into","a,","Spreadsheet","with","Python"]
# # index = 1
# # sheet.insert_row(row, index)
    
#     quota = 1

#     for x in range(0,19):
#         year = str(2000 + x)
#         yearArray = data[year]
#         print(year)
#         for element in yearArray:
#             if quota == 50:
#                 print("Sleeping for quota")
#                 time.sleep(102)
#                 quota = 1
#             # sheet.update_cell(row, 1, year)
#             # sheet.update_cell(row, 2, element["title"])
#             if len(element["authors"]) == 0:
#                 sheet.insert_row([year, element["title"]], row, "USER_ENTERED")
#             elif len(element["authors"]) == 1:
#                 # sheet.update_cell(row, 3, element["authors"][0])
#                 sheet.insert_row([year, element["title"], element["authors"][0]], row,"USER_ENTERED")
#             elif len(element["authors"]) > 1:
#                 authors = ""
#                 for x in range(0,len(element["authors"])):
#                     if x == (len(element["authors"]) - 1):
#                         authors += element["authors"][x]
#                     else:
#                         authors += element["authors"][x] + " and "
#                 # sheet.update_cell(row, 3, authors)
#                 sheet.insert_row([year, element["title"], authors], row,"USER_ENTERED")
#             row = row + 1
#             print(quota)
#             quota += 1

if __name__ == '__main__':
    # getNYBooks()
    writeNYBooksFictionGDoc()
    # getNYBooksFiction()
    # array = [1,2,3]
    # print(len(array))
    # for x in range(0,len(array)):
    #     print(x)