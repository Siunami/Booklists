import re

import gspread
from oauth2client.service_account import ServiceAccountCredentials

import time

title = re.compile('“([^"]+)”')
author = re.compile("(?<=by ).*")

# For Obama.txt
# with open('Obama.txt') as file:
# 	scope = ['https://spreadsheets.google.com/feeds',
# 	 'https://www.googleapis.com/auth/drive']
# 	creds = ServiceAccountCredentials.from_json_keyfile_name('client_secret.json', scope)
# 	client = gspread.authorize(creds)

# 	sheet = client.open("ChangeTheWorld").sheet1
# 	file_contents = file.readline()
# 	while file_contents:
# 		print(file_contents)
# 		print(re.findall('“([^"]+)”', file_contents)[0])
# 		# print(title.search(file_contents).group())
# 		print(author.search(file_contents).group())
# 		sheet.insert_row([2018, re.findall('“([^"]+)”', file_contents)[0],author.search(file_contents).group(), "Obama's Booklist"], 2, "USER_ENTERED")

# 		file_contents = file.readline()

with open('ObamaPresidency.txt') as file:
	scope = ['https://spreadsheets.google.com/feeds',
	 'https://www.googleapis.com/auth/drive']
	creds = ServiceAccountCredentials.from_json_keyfile_name('client_secret.json', scope)
	client = gspread.authorize(creds)

	sheet = client.open("ChangeTheWorld").sheet1
	file_contents = file.readline()

	rateLimit = 1

	startFrom = 71
	i = 1

	while file_contents:
		if i >= startFrom:
			if rateLimit == 50:
				time.sleep(100)
				rateLimit = 1
			print(file_contents)
			title = re.findall('[0-9]+. ([^"]+),', file_contents)[0]
			if ":" in title:
				print("HAS COLON")
				title = re.findall('[0-9]+. ([^"]+):', file_contents)[0]
			a = re.findall(', ([^"]+)\\n', file_contents)[0]

			print(title)
			print(a)
			# print(title.search(file_contents).group())
			# print(author.search(file_contents).group())
			sheet.insert_row(["During Presidency", title,a, "Obama's Booklist"], 2, "USER_ENTERED")
			rateLimit += 1
		i += 1
		file_contents = file.readline()


