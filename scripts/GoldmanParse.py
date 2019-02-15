import re

import gspread
from oauth2client.service_account import ServiceAccountCredentials

import time

title = re.compile('^(.+?),')
author = re.compile("(?<=by ).*")

years = []

def getYears():
	with open("GoldmanSachsReadingLists.txt") as f:
		line = f.readline()

		while line:
			date = re.findall('[0-9]+', line)
			print(date)
			if len(date) == 1:
				years.append(date[0])
			line = f.readline()

getYears()


with open('GoldmanSachsReadingLists.txt') as file:
	scope = ['https://spreadsheets.google.com/feeds',
	 'https://www.googleapis.com/auth/drive']
	creds = ServiceAccountCredentials.from_json_keyfile_name('client_secret.json', scope)
	client = gspread.authorize(creds)

	sheet = client.open("ChangeTheWorld").sheet1
	file_contents = file.readline()

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
				sheet.insert_row([year,title[0], a.replace('&', 'and'),"Goldman Sachs Booklist"], 2, "USER_ENTERED")
			# print(title.search(file_contents).group())
			

			file_contents = file.readline()
		rateLimit += 1