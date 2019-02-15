import re

import gspread
from oauth2client.service_account import ServiceAccountCredentials

import time

title = re.compile('“([^"]+)”')
author = re.compile("(?<=by ).*")

years = []

def getYears():
	with open("NPRdata.txt") as f:
		line = f.readline()

		while line:
			date = re.findall('([0-9]+)', line)
			# print(date)
			if len(date) == 1:
				years.append(date[0])
			line = f.readline()

getYears()

with open('NPRdata.txt') as file:
	# scope = ['https://spreadsheets.google.com/feeds',
	#  'https://www.googleapis.com/auth/drive']
	# creds = ServiceAccountCredentials.from_json_keyfile_name('client_secret.json', scope)
	# client = gspread.authorize(creds)

	# sheet = client.open("ChangeTheWorld").sheet1
	file_contents = file.readline()

	rateLimit = 1

	title = ""
	author = ""

	while file_contents:
		# if rateLimit == 50:
		# 	time.sleep(100)
		# 	rateLimit = 1
		if file_contents.strip() in years:
			# print(file_contents.strip())
			year = file_contents.strip()
		else:
			# print(file_contents)
			if title == "":
				title = re.findall('([^"]+)', file_contents)[0]
				if ":" in title:
					# print("HAS COLON")
					title = re.findall('([^"]+):', file_contents)[0]
			elif author == "":
				author = re.findall('by ([^"]+)', file_contents)
			elif not(author == "") and not(title == ""):
				print(year)
				print(title)
				print(author)
				# sheet.insert_row([year, title,author, "NPR Booklist"], 2, "USER_ENTERED")
				title = ""
				author = ""
				rateLimit += 1
		file_contents = file.readline()