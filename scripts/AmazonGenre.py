import requests
from bs4 import BeautifulSoup
import json
from pprint import pprint
import re

import os
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as ExpectedConditions
import time

import gspread
from oauth2client.service_account import ServiceAccountCredentials


testLink = "https://www.amazon.com/gp/product/076790592X/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=076790592X&linkCode=as2&tag=siunami-20&linkId=abc2b79adbf95367dd11c06376c41cdd"

def getGenres(soup):
	salesRank = soup.find("li", {"id": "SalesRank"})
	salesSoup = BeautifulSoup(str(salesRank), 'html.parser')
	links = salesSoup.findAll('a')
	# print(links)

	linkText = []
	for link in links:
		linkSoup = BeautifulSoup(str(link), 'html.parser')
		text = linkSoup.find('a').text
		linkText.append(text)
	# print(linkText)


	# TODO Can make this more robust to have deeper linking.
	genres = ""
	currGenres = []
	for x in range(0, len(linkText)):
		if linkText[x] == "Books":
			if not(linkText[x+1] in currGenres):
				currGenres.append(linkText[x+1])
				genres += linkText[x+1] + ","
		# if linkText[x] == "Kindle eBooks":
		# 	if not(linkText[x+1] in currGenres) and linkText[x+1] != "Audible Audiobooks":
		# 		currGenres.append(linkText[x+1])
		# 		genres += linkText[x+1] + ","
	print(genres)
	return genres

def getPubDate(soup):
	bookInfo = soup.find("table", {"id": "productDetailsTable"})
	productSoup = BeautifulSoup(str(bookInfo), 'html.parser')
	date = ""
	for tag in productSoup.find_all("li"):
		# print(tag.get_text())
		# print(type(tag.get_text()))
		pattern = re.compile("(Jan(uary)?|Feb(ruary)?|Mar(ch)?|Apr(il)?|May|Jun(e)?|Jul(y)?|Aug(ust)?|Sep(tember)?|Oct(ober)?|Nov(ember)?|Dec(ember)?)\s+\d{1,2},\s+\d{4}")
		pattern2 = re.compile("\d{4}")
		match = pattern.search(tag.get_text())
		match2 = pattern2.search(tag.get_text())
		if match:
			date = match.group()
			print(date)
		# elif match2:
		# 	date = match2.group()
		# 	print(date)
	return date
	# date = productSoup.find_all("li",re.compile("(Jan(uary)?|Feb(ruary)?|Mar(ch)?|Apr(il)?|May|Jun(e)?|Jul(y)?|Aug(ust)?|Sep(tember)?|Oct(ober)?|Nov(ember)?|Dec(ember)?)\s+\d{1,2},\s+\d{4}/"))
	# print("ASDFASDF")
	

def getInfo(driver, l):
	driver.get(l)
	html = driver.page_source
	
	soup = BeautifulSoup(html, 'html.parser')
	genres = getGenres(soup)
	publishDate = getPubDate(soup)

	return [genres, publishDate]
	

def getEmptyInfo(bookData):
	bookTitles = []
	i = 1
	for book in bookData:
		# If book does not have image link [4]
		if book[5] != "" and book[6] == "" and book[7] == "":
			book.append(i)
			bookTitles.append(book)
		elif book[5] != "" and book[7] == "":
			book.append(i)
			bookTitles.append(book)
		i += 1
	return bookTitles

def main():
	scope = ['https://spreadsheets.google.com/feeds',
	     'https://www.googleapis.com/auth/drive']
	creds = ServiceAccountCredentials.from_json_keyfile_name('client_secret.json', scope)
	client = gspread.authorize(creds)

	sheet = client.open("ChangeTheWorld").sheet1
	bookData = sheet.get_all_values()
	bookData = getEmptyInfo(bookData)
	# print(bookData)


	directory = os.getcwd()
	driver = webdriver.Chrome(directory + "/chromedriver")
	for book in bookData:
		print(book)
		if not(book == None):
			info = getInfo(driver, book[5])
			# sheet.update_cell(book[8], 7, info[0])
			sheet.update_cell(book[8], 8, info[1])


	driver.close()

if __name__== "__main__":
	main()

	# single link testing
	# directory = os.getcwd()
	# driver = webdriver.Chrome(directory + "/chromedriver")
	# link = "https://www.amazon.com/gp/product/076790592X/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=076790592X&linkCode=as2&tag=siunami-20&linkId=abc2b79adbf95367dd11c06376c41cdd"
	# getInfo(driver,link)
	# driver.close()


	
