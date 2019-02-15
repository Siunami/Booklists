const express = require('express');
const keys = require('./config/keys');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('./models/book');
require('./models/url');
var GoogleSpreadsheet = require('google-spreadsheet');
var creds = require('./client_secret.json');
var filterSettings = require('./scripts/filterSettings.json');
// require('./services/passport');

mongoose.connect(keys.mongoURI);


const Book = mongoose.model('books');
const Suggestion = mongoose.model('recommendations');

const app = express();

app.use(bodyParser.json());
// app.use(
// 	// Cookiesession vs. Express session
// 	// Cookie: data stored directly in cookie. Limited to 4 kbs
// 	// Express: cookie stores a session id to a mongo database.
// 	// session id maps to any quantity of data in mongo database. No data limit
// 	cookieSession({
// 		maxAge: 30 * 24 * 60 * 60 * 1000,
// 		keys: [keys.cookieKey]
// 	})
// );
// app.use(passport.initialize());
// app.use(passport.session());
app.use(express.static(__dirname + '/views'));

// require authRoutes returns a function.
// Function is immediately called with app object (app)
// Can store require in cont variable. Then call variable
// with app object as parameter.
// require('./routes/authRoutes')(app);
// require('./routes/billingRoutes')(app);

function createGenreArray(genres){
	let d = []
	let g = genres.split(",");
	if (genres == "all"){
		return data;
	}
	for (var i = 0; i < g.length; i++){
		if (g[i] != ""){
			d.push(g[i]);
		}
	}
	return d;
}

// FOR: updating database to google docs
app.get('/writeData',(req, res) => {
	var doc = new GoogleSpreadsheet('1H5gPvbuxN0Ow0oARBUh_bDFP-yoJGJrU34SytXA2zbY');

	// Authenticate with the Google Spreadsheets API.
	doc.useServiceAccountAuth(creds, function (err) {

	  // Get all of the rows from the spreadsheet.
	  doc.getRows(1, function (err, rows) {
	  	for (var i = 0; i < rows.length; i++){
	  		new Book({
	  			"title": rows[i]["title"],
	  			"authors": rows[i]["authors"],
	  			"listYear": rows[i]["listyear"],
	  			"list": rows[i]["list"],
	  			"prodLink": rows[i]["prodlink"],
	  			"link": rows[i]["link"],
	  			"genre": createGenreArray(rows[i]["genre"]),
	  			"publishDate": rows[i]["publishdate"]
	  		}).save()
	  	}
	  	res.send(rows)
	  });
	});
});

const path = require('path');
app.get('/', (req, res) => {
	// TODO: If no url params, home page with recommendations
	// Else populate search with query
	let ly = req.query.listyear;
	let l = req.query.list;
	let g = req.query.genre;

	console.log([ly,l,g]);
	if (ly == undefined && l == undefined && g == undefined){
		res.sendFile(path.join(__dirname + '/views/oldindex.html'));
	} else {
		res.sendFile(path.join(__dirname + '/views/search.html'));
	}	
})

app.get('/suggestion', (req,res) => {
	let url = req.query.url;
	console.log(url);
	new Suggestion({
		"url": url
	}).save()
	res.send("success!");
})

// app.get('/NY-Times-NonFiction-Bestseller-List', (req, res) => {
// 	res.sendFile(path.join(__dirname + '/views/NYTimesNonfiction.html'));
// })

app.get('/update.js', (req, res) => {
	res.sendFile(path.join(__dirname + '/views/update.js'));
})
app.get('/homepage.js', (req, res) => {
	res.sendFile(path.join(__dirname + '/views/homepage.js'));
})

app.get('/blog.css', (req, res) => {
	res.sendFile(path.join(__dirname + '/views/blog.css'));
})

app.get('/jquery-ui.js', (req, res) => {
	res.sendFile(path.join(__dirname + '/views/jquery-ui.js'));
})
app.get('/jquery-ui.css', (req, res) => {
	res.sendFile(path.join(__dirname + '/views/jquery-ui.css'));
})
app.get('/favicon.ico', (req, res) => {
	res.sendFile(path.join(__dirname + '/favicon.ico'));
})

function include(arr, obj) {
    for(var i=0; i<arr.length; i++) {
        if (arr[i] == obj) return true;
    }
    return false;
}

function filterData(data, genre){
	let d = []
	if (genre == "all"){
		return data;
	}
	for (var i = 0; i < data.length; i++){
		let g = data[i]["genre"].split(",");
		if (include(g, genre)){
			d.push(data[i]);
		}
	}
	console.log(d)
	return d;
}

// let filterSettings = {"Good Reads Booklist": {"2018": ["Picture Books", "Middle Grade and Children's", "Young Adult Fantasy", "Young Adult Fiction", "Debut Author", "Poetry", "Graphic Novels and Comics", "Food and Cookbooks", "Science and Technology", "History and Biography", "Memoir and Autobiography", "Nonfiction", "Humor", "Horror", "Science Fiction", "Romance", "Best of the Best", "Fantasy", "Historical Fiction", "Mystery and Thriller", "Fiction"]}, "Goldman Sachs Booklist": {"2016": ["Literature & Fiction", "Business & Money", "Politics & Social Sciences", "Biographies & Memoirs", "Textbooks", "Humor & Entertainment", "Sports & Outdoors", "Reference", "Arts & Photography", "Science & Math", "History", "Mystery", " Thriller & Suspense", "Cookbooks", " Food & Wine", "Travel", "Education & Teaching", "Health", " Fitness & Dieting", "Science Fiction & Fantasy", "Law", "Computers & Technology"], "2017": ["Politics & Social Sciences", "Science & Math", "History", "Biographies & Memoirs", "Sports & Outdoors", "Crafts", " Hobbies & Home", "Literature & Fiction", "Science Fiction & Fantasy", "Religion & Spirituality", "Engineering & Transportation", "Humor & Entertainment", "Medical Books", "Business & Money", "Reference", "Textbooks", "Health", " Fitness & Dieting", "Arts & Photography", "Law"], "2018": ["Literature & Fiction", "Politics & Social Sciences", "History", "Science Fiction & Fantasy", "Biographies & Memoirs", "Health", " Fitness & Dieting", "Self-Help", "Medical Books", "Science & Math", "Business & Money", "Mystery", " Thriller & Suspense", "Crafts", " Hobbies & Home", "Education & Teaching", "Teens", "Law", "Sports & Outdoors"]}, "Bill Gates Booklist": {"2017": ["Engineering & Transportation", "Science & Math", "Literature & Fiction", "Mystery", " Thriller & Suspense", "Arts & Photography", "Humor & Entertainment", "Biographies & Memoirs", "Politics & Social Sciences", "Comics & Graphic Novels", "History"], "2018": ["Self-Help", "Health", " Fitness & Dieting", "Religion & Spirituality", "History", "Politics & Social Sciences", "Business & Money", "Engineering & Transportation", "Biographies & Memoirs", "Science & Math", "Literature & Fiction", "Christian Books & Bibles"], "2016": ["Engineering & Transportation", "Science & Math", "Politics & Social Sciences", "Law", "Health", " Fitness & Dieting", "Medical Books", "Biographies & Memoirs", "Sports & Outdoors", "History", "Business & Money", "Textbooks", "Science Fiction & Fantasy"], "2015": ["Textbooks", "Science & Math", "Education & Teaching", "Law", "Health", " Fitness & Dieting", "Medical Books", "Romance", "Literature & Fiction", "Politics & Social Sciences", "Biographies & Memoirs", "Humor & Entertainment", "Self-Help", "Cookbooks", " Food & Wine", "Business & Money", "Comics & Graphic Novels"], "2014": ["Engineering & Transportation", "Textbooks", "Business & Money", "Medical Books", "Science & Math", "History", "Biographies & Memoirs", "Politics & Social Sciences", "Literature & Fiction", "Law"], "2013": ["Politics & Social Sciences", "Science & Math", "Business & Money", "Textbooks", "Engineering & Transportation", "Mystery", " Thriller & Suspense", "Medical Books", "Health", " Fitness & Dieting", "History", "Education & Teaching"], "2012": ["Politics & Social Sciences", "Law", "Textbooks", "Business & Money", "Mystery", " Thriller & Suspense", "Education & Teaching", "Self-Help", "Health", " Fitness & Dieting", "Science & Math", "Engineering & Transportation", "Biographies & Memoirs", "History", "Parenting & Relationships"]}, "Obama Booklist": {"2017": ["History", "Politics & Social Sciences", "Biographies & Memoirs", "Business & Money", "Computers & Technology", "Literature & Fiction", "Science & Math", "Law", "Education & Teaching", "Christian Books & Bibles", "Textbooks", "Medical Books", "Audible Audiobooks", "Engineering & Transportation", "Science Fiction & Fantasy", "Mystery", " Thriller & Suspense", "Reference", "Humor & Entertainment", "Teens", "Religion & Spirituality", "Children's Books", "Romance", "Sports & Outdoors", "Self-Help"], "2018": ["Politics & Social Sciences", "Biographies & Memoirs", "History", "Business & Money", "Travel", "Literature & Fiction", "Engineering & Transportation", "Computers & Technology", "Science & Math", "Sports & Outdoors", "Law"]}, "NY Times Fiction Bestseller": {"1944": [], "1945": ["Literature & Fiction"], "1946": ["Romance", "Literature & Fiction", "Crafts", " Hobbies & Home"], "1947": ["Crafts", " Hobbies & Home", "Literature & Fiction"], "1948": ["Literature & Fiction", "Religion & Spirituality"], "1949": ["Literature & Fiction", "Humor & Entertainment"], "1950": ["Literature & Fiction"], "1951": ["Literature & Fiction"], "1952": ["Literature & Fiction", "Romance", "Humor & Entertainment"], "1953": ["Literature & Fiction", "Humor & Entertainment"], "1954": ["Literature & Fiction", "Romance"], "1955": ["Literature & Fiction", "Humor & Entertainment"], "1956": ["Literature & Fiction", "Humor & Entertainment", "Politics & Social Sciences"], "1957": ["Humor & Entertainment", "Politics & Social Sciences", "Romance", "Mystery", " Thriller & Suspense", "Literature & Fiction"], "1958": ["Literature & Fiction", "Mystery", " Thriller & Suspense", "Humor & Entertainment"], "1959": ["Literature & Fiction", "Reference", "Mystery", " Thriller & Suspense"], "1960": ["Literature & Fiction", "Mystery", " Thriller & Suspense"], "1961": ["Literature & Fiction", "Science Fiction & Fantasy", "Mystery", " Thriller & Suspense", "Biographies & Memoirs"], "1962": ["Literature & Fiction", "Mystery", " Thriller & Suspense"], "1963": ["Mystery", " Thriller & Suspense", "Literature & Fiction"], "1964": ["Literature & Fiction", "Humor & Entertainment"], "1965": ["Literature & Fiction", "Humor & Entertainment"], "1966": ["Literature & Fiction"], "1967": ["Literature & Fiction", "Mystery", " Thriller & Suspense", "Teens"], "1968": ["Literature & Fiction", "Humor & Entertainment", "Mystery", " Thriller & Suspense"], "1969": ["Mystery", " Thriller & Suspense", "Literature & Fiction", "Humor & Entertainment"], "1970": ["Literature & Fiction", "Mystery", " Thriller & Suspense", "Romance"], "1971": ["Literature & Fiction", "Romance", "Mystery", " Thriller & Suspense"], "1972": ["Literature & Fiction", "Teens"], "1973": ["Literature & Fiction", "Teens", "Mystery", " Thriller & Suspense", "Romance", "Science Fiction & Fantasy", "Humor & Entertainment", "Children's Books"], "1974": ["Literature & Fiction", "Teens"], "1975": ["Literature & Fiction", "Mystery", " Thriller & Suspense", "Deals in Books"], "1976": ["Mystery", " Thriller & Suspense", "Literature & Fiction"], "1977": ["Literature & Fiction", "Humor & Entertainment", "Mystery", " Thriller & Suspense", "Science Fiction & Fantasy"], "1978": ["Science Fiction & Fantasy", "Literature & Fiction", "Mystery", " Thriller & Suspense"], "1979": ["Literature & Fiction", "Mystery", " Thriller & Suspense", "Humor & Entertainment", "Children's Books", "Science Fiction & Fantasy"], "1980": ["Literature & Fiction", "Mystery", " Thriller & Suspense", "Romance"], "1981": ["Literature & Fiction", "Mystery", " Thriller & Suspense", "Humor & Entertainment"], "1982": ["Literature & Fiction", "Humor & Entertainment", "Mystery", " Thriller & Suspense", "Romance"], "1983": ["Mystery", " Thriller & Suspense", "Literature & Fiction", "Humor & Entertainment"], "1984": ["Literature & Fiction", "Mystery", " Thriller & Suspense", "Romance"], "1985": ["Mystery", " Thriller & Suspense", "Literature & Fiction", "Romance", "Audible Audiobooks", "Politics & Social Sciences"], "1986": ["Politics & Social Sciences", "Mystery", " Thriller & Suspense", "Literature & Fiction", "Audible Audiobooks", "Romance"], "1987": ["Literature & Fiction", "Mystery", " Thriller & Suspense", "Science Fiction & Fantasy", "Romance"], "1988": ["Literature & Fiction", "Science Fiction & Fantasy", "Humor & Entertainment", "Audible Audiobooks", "Mystery", " Thriller & Suspense", "Romance"], "1989": ["Literature & Fiction", "Mystery", " Thriller & Suspense", "Science Fiction & Fantasy", "Politics & Social Sciences", "Humor & Entertainment"], "1990": ["Mystery", " Thriller & Suspense", "Literature & Fiction", "Children's Books", "Audible Audiobooks", "Science Fiction & Fantasy"], "1991": ["Mystery", " Thriller & Suspense", "Literature & Fiction", "Romance", "Religion & Spirituality", "Audible Audiobooks", "Children's Books", "Science Fiction & Fantasy"], "1992": ["Literature & Fiction", "Mystery", " Thriller & Suspense", "Romance", "Children's Books"], "1993": ["Mystery", " Thriller & Suspense", "Literature & Fiction"], "1994": ["Romance", "Literature & Fiction", "Mystery", " Thriller & Suspense", "Humor & Entertainment"], "1995": ["Humor & Entertainment", "Literature & Fiction", "Mystery", " Thriller & Suspense", "Science & Math", "Science Fiction & Fantasy", "Christian Books & Bibles"], "1996": ["Literature & Fiction", "Christian Books & Bibles", "Mystery", " Thriller & Suspense", "Humor & Entertainment", "Romance"], "1997": ["Mystery", " Thriller & Suspense", "Literature & Fiction", "Science Fiction & Fantasy"], "1998": ["Literature & Fiction", "Science Fiction & Fantasy", "Mystery", " Thriller & Suspense", "Romance", "Politics & Social Sciences", "Humor & Entertainment"], "1999": ["Humor & Entertainment", "Mystery", " Thriller & Suspense", "Literature & Fiction", "Audible Audiobooks", "Science Fiction & Fantasy", "Children's Books", "Teens"], "2000": ["Children's Books", "Mystery", " Thriller & Suspense", "Literature & Fiction", "Books on CD", "Religion & Spirituality", "Romance", "Science Fiction & Fantasy", "Christian Books & Bibles"], "2001": ["Mystery", " Thriller & Suspense", "Literature & Fiction", "Audible Audiobooks", "Science Fiction & Fantasy", "Christian Books & Bibles", "Romance", "Humor & Entertainment", "Books on CD", "Religion & Spirituality"], "2002": ["Literature & Fiction", "Mystery", " Thriller & Suspense", "Reference", "Children's Books", "Romance", "Teens", "Christian Books & Bibles", "Books on CD", "Religion & Spirituality", "Science Fiction & Fantasy"], "2003": ["Mystery", " Thriller & Suspense", "Literature & Fiction", "Science Fiction & Fantasy", "Politics & Social Sciences", "Books on CD", "Religion & Spirituality", "Romance", "Reference"], "2004": ["Literature & Fiction", "Politics & Social Sciences", "Mystery", " Thriller & Suspense", "Books on CD", "Religion & Spirituality", "Science Fiction & Fantasy", "Romance", "Reference"], "2005": ["Literature & Fiction", "Reference", "Politics & Social Sciences", "Mystery", " Thriller & Suspense", "Romance", "Science Fiction & Fantasy"], "2006": ["Mystery", " Thriller & Suspense", "Literature & Fiction", "Politics & Social Sciences", "Romance", "Science Fiction & Fantasy"], "2007": ["Literature & Fiction", "Mystery", " Thriller & Suspense", "Textbooks", "Science Fiction & Fantasy", "Reference", "Romance", "Humor & Entertainment"], "2008": ["Mystery", " Thriller & Suspense", "Literature & Fiction", "Reference", "Audible Audiobooks", "Science Fiction & Fantasy", "Deals in Books", "Travel", "Romance", "Christian Books & Bibles"], "2009": ["Christian Books & Bibles", "Literature & Fiction", "Mystery", " Thriller & Suspense", "Science Fiction & Fantasy", "Romance", "Travel", "Deals in Books", "Humor & Entertainment"], "2010": ["Literature & Fiction", "Mystery", " Thriller & Suspense", "Engineering & Transportation", "Romance", "Science Fiction & Fantasy", "Biographies & Memoirs", "Audible Audiobooks", "Teens"], "2011": ["Audible Audiobooks", "Literature & Fiction", "Mystery", " Thriller & Suspense", "Romance", "Science Fiction & Fantasy", "Engineering & Transportation", "Humor & Entertainment"], "2012": ["Science Fiction & Fantasy", "Literature & Fiction", "Mystery", " Thriller & Suspense", "Humor & Entertainment"], "2013": ["Mystery", " Thriller & Suspense", "Literature & Fiction", "Parenting & Relationships", "Romance", "Science Fiction & Fantasy"], "2014": ["Mystery", " Thriller & Suspense", "Literature & Fiction", "Teens", "Romance", "Science Fiction & Fantasy", "Humor & Entertainment", "Crafts", " Hobbies & Home", "Reference"], "2015": ["Mystery", " Thriller & Suspense", "Reference", "Literature & Fiction", "Romance", "Science Fiction & Fantasy", "Humor & Entertainment"], "2016": ["Mystery", " Thriller & Suspense", "Literature & Fiction", "Romance", "Science Fiction & Fantasy", "Humor & Entertainment"], "2017": ["Mystery", " Thriller & Suspense", "Literature & Fiction", "Audible Audiobooks", "Christian Books & Bibles", "Reference", "Romance", "Science Fiction & Fantasy"], "2018": ["Literature & Fiction", "Mystery", " Thriller & Suspense", "Romance", "Science Fiction & Fantasy", "Humor & Entertainment"]}, "NY Times Nonfiction Bestseller": {"2000": ["Self-Help", "Biographies & Memoirs", "Politics & Social Sciences", "Sports & Outdoors", "Arts & Photography", "History", "Religion & Spirituality", "Engineering & Transportation", "Humor & Entertainment", "Nonfiction"], "2001": ["Nonfiction", "Politics & Social Sciences", "Biographies & Memoirs", "Health", " Fitness & Dieting", "Textbooks", "Sports & Outdoors", "Humor & Entertainment", "History", "Business & Money", "Arts & Photography"], "2002": ["Nonfiction", "Politics & Social Sciences", "History", "Biographies & Memoirs", "Business & Money", "Humor & Entertainment", "Literature & Fiction", "Health", " Fitness & Dieting", "Education & Teaching", "Parenting & Relationships", "Self-Help", "Sports & Outdoors", "Religion & Spirituality", "Arts & Photography", "Law"], "2003": ["Politics & Social Sciences", "Law", "Biographies & Memoirs", "Nonfiction", "Business & Money", "Humor & Entertainment", "Literature & Fiction", "History"], "2004": ["Humor & Entertainment", "Politics & Social Sciences", "History", "Reference", "Literature & Fiction", "Biographies & Memoirs", "Deals in Books", "Audible Audiobooks"], "2005": ["Humor & Entertainment", "Politics & Social Sciences", "Literature & Fiction", "Biographies & Memoirs", "Business & Money", "Health", " Fitness & Dieting", "Sports & Outdoors", "Travel", "Self-Help", "Science & Math", "Religion & Spirituality", "Reference", "History", "Textbooks"], "2006": ["Biographies & Memoirs", "History", "Politics & Social Sciences", "Religion & Spirituality", "Health", " Fitness & Dieting", "Self-Help", "Crafts", " Hobbies & Home", "Business & Money", "Humor & Entertainment", "Literature & Fiction", "Nonfiction", "Parenting & Relationships", "Deals in Books", "Law"], "2007": ["Politics & Social Sciences", "Biographies & Memoirs", "History", "Science & Math", "Religion & Spirituality", "Arts & Photography", "Humor & Entertainment", "Nonfiction", "Business & Money", "Deals in Books", "Law"], "2008": ["Humor & Entertainment", "Health", " Fitness & Dieting", "Self-Help", "Cookbooks", " Food & Wine", "Biographies & Memoirs", "Politics & Social Sciences", "Christian Books & Bibles", "Arts & Photography", "History", "Engineering & Transportation", "Science & Math"], "2009": ["Science & Math", "Politics & Social Sciences", "Biographies & Memoirs", "Sports & Outdoors", "Humor & Entertainment", "Religion & Spirituality", "Christian Books & Bibles"], "2010": ["Biographies & Memoirs", "Religion & Spirituality", "Christian Books & Bibles", "Travel", "Politics & Social Sciences", "Humor & Entertainment", "Reference", "Business & Money", "Literature & Fiction", "Textbooks", "Science & Math", "History", "Arts & Photography"], "2011": ["Biographies & Memoirs", "Politics & Social Sciences", "History", "Science & Math", "Health", " Fitness & Dieting", "Arts & Photography", "Business & Money", "Humor & Entertainment", "Sports & Outdoors", "Self-Help", "Computers & Technology"], "2012": ["Computers & Technology", "Biographies & Memoirs", "Business & Money", "History", "Politics & Social Sciences", "Health", " Fitness & Dieting", "Self-Help", "Science & Math", "Sports & Outdoors", "Travel"], "2013": ["History", "Biographies & Memoirs", "Politics & Social Sciences", "Business & Money", "Sports & Outdoors", "Humor & Entertainment", "Travel", "Literature & Fiction", "Nonfiction", "Christian Books & Bibles", "Law", "Religion & Spirituality", "Arts & Photography"], "2014": ["Politics & Social Sciences", "Biographies & Memoirs", "History", "Medical Books", "Health", " Fitness & Dieting", "Science & Math", "Textbooks", "Travel", "Humor & Entertainment", "Business & Money", "Literature & Fiction", "Arts & Photography"], "2015": ["History", "Biographies & Memoirs", "Engineering & Transportation", "Politics & Social Sciences", "Self-Help", "Humor & Entertainment", "Religion & Spirituality", "Travel", "Literature & Fiction", "Arts & Photography"], "2016": ["Politics & Social Sciences", "Biographies & Memoirs", "Parenting & Relationships", "Nonfiction", "Medical Books", "Literature & Fiction", "Arts & Photography", "Teens", "Health", " Fitness & Dieting", "History", "Law", "Humor & Entertainment", "Religion & Spirituality", "Christian Books & Bibles"], "2017": ["History", "Health", " Fitness & Dieting", "Literature & Fiction", "Humor & Entertainment", "Politics & Social Sciences", "Engineering & Transportation", "Science & Math", "Arts & Photography", "Biographies & Memoirs", "Self-Help", "Business & Money", "Parenting & Relationships"], "2018": ["Biographies & Memoirs", "History", "Science & Math", "Politics & Social Sciences", "Self-Help", "Law", "Medical Books", "Religion & Spirituality", "Humor & Entertainment", "Business & Money", "Cookbooks", " Food & Wine", "Arts & Photography"]}}
app.get('/settings', (req,res)=>{
	// console.log(filterSettings);
	res.send(filterSettings);
});

app.get('/data', (req,res)=>{
	let query = {}
	let listyear = req.query.listyear;
	let list = req.query.list;
	let genre = req.query.genre;
	query['list'] = list;
	if (listyear != "all"){
		query['listYear'] = listyear;
	}
	if (genre != "all"){
		query['genre'] = genre;
	}
	console.log(query);

	Book.find(query, function(err,dat){
		if (err){
			res.send([]);
		}
		// let filteredData = filterData(dat, genre)
		console.log(dat.length)
		res.send(dat);
	})
})

// if (process.env.NODE_ENV === 'production'){
// 	// Express will serve up production assets
// 	// like main.js file, or main.css file from build
// 	app.use(express.static('client/build'));

// 	// Express will serve up index.html file
// 	// if it doesn't recognize the route
// 	const path = require('path');
// 	app.get('/', (req, res) => {
// 		res.sendFile(path.join(__dirname + '/views/index.html'));
// 	})
// }

const PORT = process.env.PORT || 5000;
app.listen(PORT);