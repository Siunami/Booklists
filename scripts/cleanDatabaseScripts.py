import gspread
from oauth2client.service_account import ServiceAccountCredentials

import json
from pprint import pprint

# get all genres in database from comma separated string
def getGenres(bookData):
	genreList = []
	for book in bookData:
		genres = book[6].split(",")
		for g in genres:
			if g != "" and g != "genre" and not(g in genreList):
				genreList.append(g)
	print(genreList)
	with open('genres.json', 'w') as outfile:
		json.dump(genreList, outfile)

def parseGenres(genres):
	genreList = []
	g = genres.split(",")
	for g in genres:
		if g != "" and g != "genre" and not(g in genreList):
			genreList.append(g)
	return genreList

def addGenres(g, genres):
	for el in genres.split(","):
		if not(el in g) and el != "":
			g.append(el)
	return g

def filterTree(bookData):
	pprint(bookData)
	nonFiction = []
	fiction = []
	for el in bookData:
		if el[3] == "NY Times Nonfiction Bestseller":
			nonFiction = addGenres(nonFiction, el[6])
		if el[3] == "NY Times Fiction Bestseller":
			fiction = addGenres(fiction ,el[6])
	return [nonFiction, fiction]


# el[3] == list
# el[0] == listYear
# el[6] == genres
def filterObject(bookData):
	pprint(bookData)
	lists = {}
	for el in bookData:
		if el[3] in lists:
			if el[0] in lists[el[3]]:
				lists[str(el[3])][str(el[0])] = addGenres(lists[str(el[3])][str(el[0])], el[6])
			else:
				lists[str(el[3])][str(el[0])] = []
				lists[str(el[3])][str(el[0])] = addGenres(lists[str(el[3])][str(el[0])], el[6])
		elif el[3] != "List":
			lists[str(el[3])] = {}
			lists[str(el[3])][str(el[0])] = []
			lists[str(el[3])][str(el[0])] = addGenres(lists[str(el[3])][str(el[0])], el[6])
	pprint(lists)
	return lists



def main():
	scope = ['https://spreadsheets.google.com/feeds',
	     'https://www.googleapis.com/auth/drive']
	creds = ServiceAccountCredentials.from_json_keyfile_name('client_secret.json', scope)
	client = gspread.authorize(creds)

	sheet = client.open("ChangeTheWorld").sheet1
	bookData = sheet.get_all_values()

	# getGenres(bookData)
	with open('filterSettings.json', 'w') as outfile:
		json.dump(filterObject(bookData), outfile)
	# pprint(filterObject(bookData))




if __name__== "__main__":
	main()