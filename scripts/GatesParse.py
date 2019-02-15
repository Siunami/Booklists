import re

import gspread
from oauth2client.service_account import ServiceAccountCredentials

import time

title = re.compile('^(.+?),')
author = re.compile("(?<=by ).*")


with open('Gates.txt') as file:
	scope = ['https://spreadsheets.google.com/feeds',
	 'https://www.googleapis.com/auth/drive']
	creds = ServiceAccountCredentials.from_json_keyfile_name('client_secret.json', scope)
	client = gspread.authorize(creds)

	sheet = client.open("ChangeTheWorld").sheet1
	file_contents = file.readline()
	years = ["2012","2013","2014","2015","2016","2017","2018"]

	rateLimit = 0

	while file_contents:
		if rateLimit == 50:
			time.sleep(100)
			rateLimit = 0
		if file_contents.strip() in years:
			print("AS")
			print(file_contents.strip())
			year = file_contents
			file_contents = file.readline()
		else:
			print("NOT A YEAR")
			print(file_contents.split(" by")[0])
			a = author.search(file_contents).group()
			
			title = re.findall('^(.+?),', file_contents.split(" by")[0])
			if len(title) == 0:
				title = file_contents.split(" by")[0]
				print([title, a])
				sheet.insert_row([year,title, a.replace('&', 'and'),"Bill Gates Booklist"], 2, "USER_ENTERED")
			else:
				print([title, a])
				sheet.insert_row([year,title[0], a.replace('&', 'and'),"Bill Gates Booklist"], 2, "USER_ENTERED")
			# print(title.search(file_contents).group())
			

			file_contents = file.readline()
		rateLimit += 1



# import requests
# from bs4 import BeautifulSoup

# from pprint import pprint

# import os
# from selenium import webdriver
# from selenium.webdriver.common.keys import Keys
# from selenium.webdriver.common.by import By
# from selenium.webdriver.support.ui import WebDriverWait
# from selenium.webdriver.support import expected_conditions as ExpectedConditions
# import time

# import gspread
# from oauth2client.service_account import ServiceAccountCredentials

# scope = ['https://spreadsheets.google.com/feeds',
#  'https://www.googleapis.com/auth/drive']
# creds = ServiceAccountCredentials.from_json_keyfile_name('client_secret.json', scope)
# client = gspread.authorize(creds)

# sheet = client.open("ChangeTheWorld").sheet1

# directory = os.getcwd()
# driver = webdriver.Chrome(directory + "/chromedriver")

# def scrapeGatesBooks(url, year):
# 	driver.get(url)
# 	html = driver.page_source

# 	# r = requests.get("https://www.gatesnotes.com/About-Bill-Gates/Summer-Books-2018")
# 	# r.raise_for_status()
# 	# html = r.text.encode('utf8')
# 	soup = BeautifulSoup(html, 'html.parser')

# 	articleContent = soup.find("div", {"id":"content_0_articlePanel"})
# 	# pprint(articleContent)
# 	books = articleContent.find_all("a");
# 	# pprint(books)

# 	def parseBook(book):
# 		title = book.find("em")
# 		author = book.find("strong")
# 		# title = re.compile('“([^"]+)”')
# 		if title == None and author == None:
# 			return ""
# 		else:
# 			pattern = re.compile("(?<=, by ).*")
# 			author = pattern.search(author.text)
# 			return [title.text,author.group()]
			

# 	for x in range(0, len(books)):
# 		data = parseBook(books[x])
# 		if data != "":
# 			print(data)
# 			sheet.insert_row([year, data[0],data[1], "Bill Gates Booklist"], 2, "USER_ENTERED")

# for x in range(2015,2019):
# 	winter = "https://www.gatesnotes.com/About-Bill-Gates/Best-Books-"
# 	summer = "https://www.gatesnotes.com/About-Bill-Gates/Summer-Books-"
# 	scrapeGatesBooks(winter+str(x), x)

# driver.close()

	# file_contents = file.readline()
	# while file_contents:
	# 	print(file_contents)
	# 	print(re.findall('“([^"]+)”', file_contents)[0])
	# 	# print(title.search(file_contents).group())
	# 	print(author.search(file_contents).group())
	# 	sheet.insert_row([2018, re.findall('“([^"]+)”', file_contents)[0],author.search(file_contents).group(), "Obama's Booklist"], 2, "USER_ENTERED")

	# 	file_contents = file.readline()