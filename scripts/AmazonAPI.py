import pyautogui
import time
import clipboard
import pyperclip
from bs4 import BeautifulSoup

import gspread
from oauth2client.service_account import ServiceAccountCredentials

# Instructions
# Login to amazon associates
# make sure window is full screen but not green button.

# TODO
# Give it a list of books
# give it respective row + column in google sheets to write to.

def clickProductTab():
	pyautogui.scroll(500)
	productDropdown = (240,261)
	productLink = (218,297)

	pyautogui.moveTo(productDropdown[0], productDropdown[1])
	pyautogui.click()
	pyautogui.moveTo(productLink[0], productLink[1])
	pyautogui.click()

def searchProductLink(product, author):
	pyautogui.scroll(-5)
	searchProduct = (686, 597)
	searchProductButton =  (801, 599)
	pyautogui.moveTo(searchProduct[0], searchProduct[1])
	pyautogui.click()
	print("\n")
	print("TITLE: " + product)
	pyautogui.typewrite(product + " " + author)
	pyautogui.moveTo(searchProductButton[0], searchProductButton[1])
	pyautogui.click()

def clickProductLink():
	pyautogui.scroll(-5)

	getLinkButton = (1075, 625)
	pyautogui.moveTo(getLinkButton[0], getLinkButton[1])
	pyautogui.click()

	getLinkButton = (1075, 610)
	pyautogui.moveTo(getLinkButton[0], getLinkButton[1])
	pyautogui.click()

	getLinkButton2 = (1074, 588)
	pyautogui.moveTo(getLinkButton2[0], getLinkButton2[1])
	pyautogui.click()

def getProductData():
	imageHTMLTab = (992, 645)
	pyautogui.moveTo(imageHTMLTab[0], imageHTMLTab[1])
	pyautogui.click()

	pyautogui.scroll(-15)

	HTMLCode = (668, 610)
	pyautogui.moveTo(HTMLCode[0], HTMLCode[1])
	pyautogui.click()
	pyautogui.hotkey('ctrl', 'c')

	HTMLCode = (635, 580)
	pyautogui.moveTo(HTMLCode[0], HTMLCode[1])
	pyautogui.click()
	pyautogui.hotkey('ctrl', 'c')

	text = pyperclip.paste()

	soup = BeautifulSoup(text, 'html.parser')

	link = soup.find('a')
	if link:
		return [text,link['href']]
	print(text)
	print(link)
	return[text,""]

def getProductLink(product, author):
	clickProductTab()
	time.sleep(6)
	searchProductLink(product, author)
	time.sleep(6)
	clickProductLink()
	time.sleep(8)
	return getProductData()
	pyautogui.scroll(30)
	return text

def getList(bookData):
	bookTitles = []
	i = 1
	for book in bookData:
		# i = 1 is table headers
		if i != 1:
			bookTitles.append(book)
		i += 1
	return bookTitles

# Takes the index of the google sheet you want to start from
def startFrom(l, index):
	newList = []
	for i in range(index-2, len(l)):
		newList.append(l[i])
	return newList

def getEmptyLinks(bookData):
	bookTitles = []
	i = 1
	for book in bookData:
		# If book does not have image link [4]
		if book[4] == "":
			book.append(i)
			bookTitles.append(book)
		i += 1
	return bookTitles

# extract pure link from books that don't have it already
def addLink(bookData, sheet):
	i = 1
	quota = 1
	for book in bookData:
		if book[4] and book[5] == "":
			if quota == 50:
				print("Sleeping for quota")
				time.sleep(102)
				quota = 1
			soup = BeautifulSoup(book[4], 'html.parser')
			link = soup.find('a')['href']
			sheet.update_cell(i, 6, link)
			quota += 1
		i += 1
	

def replaceAmpersand(str):
	return str.replace('&', 'and')

def main():
	scope = ['https://spreadsheets.google.com/feeds',
	     'https://www.googleapis.com/auth/drive']
	creds = ServiceAccountCredentials.from_json_keyfile_name('client_secret.json', scope)
	client = gspread.authorize(creds)

	sheet = client.open("ChangeTheWorld").sheet1
	bookData = sheet.get_all_values()

	# addLink(bookData, sheet)



	# row = 283

	# bookList = getList(sheet)
	# bookList = startFrom(bookList, row)
	# print(bookList)

	# prevLink = ""
	# for book in bookList:
	# 	prodLink = getProductLink(book[1],book[2])
	# 	if prodLink != prevLink:
	# 		sheet.update_cell(row, 5, prodLink)
	# 	prevLink = prodLink
	# 	row += 1

	bookList = getEmptyLinks(bookData)
	print(len(bookList))
	print(bookList)


	prevLink = ""
	rateLimit = 1

	for book in bookList:
		if rateLimit == 50:
			time.sleep(101)
			rateLimit = 1
		prodLink = getProductLink(replaceAmpersand(book[1]),book[2])
		if prodLink != prevLink:
			sheet.update_cell(book[8], 5, prodLink[0])
			sheet.update_cell(book[8], 6, prodLink[1])
			rateLimit += 1
		prevLink = prodLink

if __name__== "__main__":
	main()

	# getProductLink("tuesdays with morrie","mitch albom")
	# productDropdown = (240,261)
	# productLink = (218,297)

	# pyautogui.moveTo(productDropdown[0], productDropdown[1])
	# pyautogui.click()
	# # getProductData()
	# pyautogui.scroll(-15)
	# print('Press Ctrl-C to quit.')
	# try:
	# 	while True:
	# 		# TODO: Get and print the mouse coordinates.
	# 		x, y = pyautogui.position()
	# 		positionStr = 'X: ' + "(" + str(x).rjust(4) + ',' + str(y).rjust(4) + ")"
	# 		print(positionStr, end='')
	# 		print('\b' * len(positionStr), end='', flush=True)
	# except KeyboardInterrupt:
	# 	print('\nDone.')





# import os
# from selenium import webdriver
# from selenium.webdriver.common.keys import Keys
# from selenium.webdriver.common.by import By
# from selenium.webdriver.support.ui import WebDriverWait
# from selenium.webdriver.support import expected_conditions as ExpectedConditions
# import time

# directory = os.getcwd()
# driver = webdriver.Chrome(directory + "/chromedriver")
# driver.get("https://affiliate-program.amazon.com/")

# # login button
# login = driver.find_element_by_id("a-autoid-0-announce")
# login.click()

# time.sleep(2)

# # email field
# email = driver.find_element_by_id("ap_email")
# password = driver.find_element_by_id("ap_password")
# email.send_keys("siunami.matt@gmail.com")
# password.send_keys("Ubc67259913")
# email.send_keys(Keys.RETURN)

