let genres = ["Literature & Fiction", "Christian Books & Bibles", "Self-Help", "Biographies & Memoirs", "Politics & Social Sciences", "Sports & Outdoors", "Arts & Photography", "History", "Religion & Spirituality", "Engineering & Transportation", "Humor & Entertainment", "Nonfiction", "Health", " Fitness & Dieting", "Textbooks", "Business & Money", "Education & Teaching", "Parenting & Relationships", "Law", "Reference", "Deals in Books", "Travel", "Science & Math", "Crafts", " Hobbies & Home", "Cookbooks", " Food & Wine", "Computers & Technology", "Medical Books", "Teens"]
let settings;
let currentData;


function parseGenres(gList){
	let str = ""
	if (gList.length == 0){
		return str;
	}
	for (var i = 0; i < gList.length; i++){
		if (i + 1 == gList.length){
			str += gList[i];
		} else {
			str += gList[i] + ", "
		}
	}
	return str;
}


// Gets genres for a all years in a list
function getFilterGenreSettings(list, listYearsArray){
	let genreList = []
	for (var i = 0; i < listYearsArray.length; i++){
		// genres for a single year in list
		let genres = settings[list][listYearsArray[i]];
		for (var x = 0; x < genres.length; x++){
			if (!genreList.includes(genres[x])){
				genreList.push(genres[x]);
			}
		}
	}
	return genreList;
}

// Gets all years in a list with genre
function getFilterYearSettings(list, genre){
	let validYears = []
	let yearsToCheck = Object.keys(settings[list]);
	for (var i = 0; i < yearsToCheck.length; i++){
		let genres = settings[list][yearsToCheck[i]];
		if (genres.includes(genre)){
			validYears.push(yearsToCheck[i]);
		}
	}
	return validYears;
}

function appendGenre(value,text,selected){
	if (selected){
		$("#genre").append($('<option>', {
		    value: value,
		    text: text,
		    selected: "selected"
		}));
	} else {
		$("#genre").append($('<option>', {
		    value: value,
		    text: text
		}));
	}
}

function appendListYear(value,text,selected){
	if (selected){
		$("#listyear").append($('<option>', {
		    value: value,
		    text: text,
		    selected: "selected"
		}));
	} else {
		$("#listyear").append($('<option>', {
		    value: value,
		    text: text
		}));
	}
}

function sortByYear(){
	console.log(currentData);
	console.log("here");
}

function updateOptions(genreSettings, listyear,list,genre){
	console.log("GOT HERE");
	console.log(genreSettings);
	console.log(listyear);

	// let currentURL = window.location.href;
	// var url = new URL(currentURL);
	// var list = url.searchParams.get("list");

	let queryGenre;
	let queryListYear;

	$("#genre").html("")
	if (genreSettings.includes(genre)) {
		for (var i = 0; i < genreSettings.length; i++){
			if (genreSettings[i] == genre){
				appendGenre(genreSettings[i],genreSettings[i],true);
			} else {
				appendGenre(genreSettings[i],genreSettings[i],false);
			}

		}
		appendGenre("all","All Genres",false);
		// getQuery(listyear,list,genre);
		queryGenre = genre;
	} else {
		for (var i = 0; i < genreSettings.length; i++){
			appendGenre(genreSettings[i],genreSettings[i],false);
		}
		appendGenre("all","All Genres",true);
		// getQuery(listyear,list,"all");
		queryGenre = "all";
	}

	$("#listyear").html("")
	let yearList = Object.keys(settings[list]);
	if (listyear != "all"){
		for (var i = 0; i < yearList.length; i++){
			if (yearList[i] == listyear){
				appendListYear(yearList[i],yearList[i],true);
			} else {
				appendListYear(yearList[i],yearList[i],false);
			}
		}
		appendListYear("all","All Years",false);
		queryListYear = listyear;
	} else {
		for (var i = 0; i < yearList.length; i++){
			appendListYear(yearList[i],yearList[i],false);
		}
		appendListYear("all","All Years",true);
		queryListYear = "all";
	}

	$("#list").html("")
	let lists = Object.keys(settings);
	for (var i = 0; i < lists.length; i++){
		if (lists[i] == list){
			$("#list").append($('<option>', {
			    value: lists[i],
			    text: lists[i],
			    selected: true
			}));
		} else {
			$("#list").append($('<option>', {
			    value: lists[i],
			    text: lists[i]
			}));
		}
	}

	// TODO: sortByYear
	sortByYear();

	getQuery(queryListYear,list,queryGenre);
}

// for listyear and genre, possibility of "all" selection
function updateSettings1(listyear,list,genre){
	console.log("TRIPLE");
	// var listyear = $("#listyear").val();
	// var list = $("#list").val();
	// let genre = $("#genre").val();

	// var listyear = $("#listyear").val();
	// let list = $("#list").val();
	// let genre = $("#genre").val();
	// let defaultParams = [listyear,list,genre];

	// let currentURL = window.location.href;
	// console.log("\n\n\n\n\n");
	// console.log(currentURL);
	// var url = new URL(currentURL);
	// var urlListYear = url.searchParams.get("listyear");
	// var urlList = url.searchParams.get("list");
	// var urlGenre = url.searchParams.get("genre");
	
	// let urlParams = [urlListYear,urlList,urlGenre];
	// console.log(urlParams);
	// for (let i = 0; i < urlParams.length; i++){
	// 	if (urlParams[i] == null) {
	// 		urlParams[i] = defaultParams[i];
	// 	}
	// }
	// listyear = urlParams[0];
	// list = urlParams[1];
	// genre = urlParams[2];
	if (listyear == "all"){
		let filterListYearSettings = Object.keys(settings[list]);
		let filterGenreSettings = getFilterGenreSettings(list, filterListYearSettings);
		updateOptions(filterGenreSettings, listyear,list,genre);
	} else {
		let years = Object.keys(settings[list]);
		if (years.includes(listyear)){
			let filterGenreSettings = settings[list][listyear];
			updateOptions(filterGenreSettings, listyear,list,genre);
		} else {
			let filterListYearSettings = Object.keys(settings[list]);
			let filterGenreSettings = getFilterGenreSettings(list, filterListYearSettings);
			updateOptions(filterGenreSettings, "all",list,genre);
		}
		
	}



	// // Most general case, all genre and all listyear. 
	// // Get all list years. get genres for years
	// if (listyear == "all" && genre == "all"){
	// 	let filterListYearSettings = Object.keys(settings[list]);
	// 	console.log(filterListYearSettings);
	// 	let filterGenreSettings =getFilterGenreSettings (list, filterListYearSettings);
	// 	console.log(filterGenreSettings)
	// 	updateOptions(filterGenreSettings,filterListYearSettings);
	// // specific list year, all genres. can just get array for listyear
	// } else if (listyear != "all" && genre == "all"){
	// 	let filterListYearSettings = [listyear];
	// 	let filterGenreSettings = settings[list][listyear];
	// 	console.log(filterListYearSettings)
	// 	console.log(filterGenreSettings)
	// 	updateOptions(filterGenreSettings,filterListYearSettings);
	// // specific genre, all years. Need to get array of genres for all years
	// } else if (genre != "all" && listyear == "all"){
	// 	let filterGenreSettings = [genre];
	// 	let filterListYearSettings = getFilterYearSettings(list, genre[0]);
	// 	console.log(filterGenreSettings)
	// 	console.log(filterListYearSettings);
	// 	updateOptions(filterGenreSettings,filterListYearSettings);
	// } else if (listyear != "all" && genre != "all") {
	// 	updateOptions([genre],[listyear]);
	// }
}

// http://localhost:5000/?listyear=2014

function updateSettings2(){
	console.log("NONE");
	let listyear = $("#listyear").val();
	let list = $("#list").val();
	let genre = $("#genre").val();

	let updateURLParams = "?listyear=" + listyear + "&genre=" + genre.replace(/&/g,"%26") + "&list=" + list
	window.location.href = updateURLParams


	// // // var listyear = $("#listyear").val();
	// // // let list = $("#list").val();
	// // // let genre = $("#genre").val();
	// let defaultParams = [listyear,list,genre];

	// let currentURL = window.location.href;
	// console.log("\n\n\n\n\n");
	// console.log(currentURL);
	// var url = new URL(currentURL);
	// var urlListYear = url.searchParams.get("listyear");
	// var urlList = url.searchParams.get("list");
	// var urlGenre = url.searchParams.get("genre");
	
	// let urlParams = [urlListYear,urlList,urlGenre];
	// console.log(urlParams);
	// for (let i = 0; i < urlParams.length; i++){
	// 	if (urlParams[i] == null) {
	// 		urlParams[i] = defaultParams[i];
	// 	}
	// }
	// listyear = urlParams[0];
	// list = urlParams[1];
	// genre = urlParams[2];

	// let updateURLParams = "?listyear=" + listyear + "&genre=" + genre.replace(/&/g,"%26") + "&list=" + list
	// window.location.href = updateURLParams



	if (listyear == "all"){
		let filterListYearSettings = Object.keys(settings[list]);
		let filterGenreSettings = getFilterGenreSettings(list, filterListYearSettings);
		updateOptions(filterGenreSettings, listyear,list,genre);
	} else {
		let years = Object.keys(settings[list]);
		if (years.includes(listyear)){
			let filterGenreSettings = settings[list][listyear];
			updateOptions(filterGenreSettings, listyear, list,genre);
		} else {
			let filterListYearSettings = Object.keys(settings[list]);
			let filterGenreSettings = getFilterGenreSettings(list, filterListYearSettings);
			updateOptions(filterGenreSettings, "all", list,genre);
		}
		
	}



	// // Most general case, all genre and all listyear. 
	// // Get all list years. get genres for years
	// if (listyear == "all" && genre == "all"){
	// 	let filterListYearSettings = Object.keys(settings[list]);
	// 	console.log(filterListYearSettings);
	// 	let filterGenreSettings =getFilterGenreSettings (list, filterListYearSettings);
	// 	console.log(filterGenreSettings)
	// 	updateOptions(filterGenreSettings,filterListYearSettings);
	// // specific list year, all genres. can just get array for listyear
	// } else if (listyear != "all" && genre == "all"){
	// 	let filterListYearSettings = [listyear];
	// 	let filterGenreSettings = settings[list][listyear];
	// 	console.log(filterListYearSettings)
	// 	console.log(filterGenreSettings)
	// 	updateOptions(filterGenreSettings,filterListYearSettings);
	// // specific genre, all years. Need to get array of genres for all years
	// } else if (genre != "all" && listyear == "all"){
	// 	let filterGenreSettings = [genre];
	// 	let filterListYearSettings = getFilterYearSettings(list, genre[0]);
	// 	console.log(filterGenreSettings)
	// 	console.log(filterListYearSettings);
	// 	updateOptions(filterGenreSettings,filterListYearSettings);
	// } else if (listyear != "all" && genre != "all") {
	// 	updateOptions([genre],[listyear]);
	// }
}


// TODO: Write code for table view
// Must receive only dat for tables to be drawn
// Pagination function must be placed in between
// dat saved somewhere
function updateView(dat) {
	currentData = dat;
	console.log(dat);
	let book = $(".books")
	// With date published
	// bookHtml = "<table class='table-responsive table-hover'><thead><tr><th scope='col'>Title</th><th scope='col'>Author</th><th scope='col'>List</th><th scope='col'>List Year</th><th scope='col'>Genre</th><th scope='col'>Date Published</th><th scope='col'>Image</th></tr></thead><tbody>"
	bookHtml = "<table class='table table-responsive table-bordered table-hover'><thead><tr><th style='padding-right:15px' scope='col'>Title</th><th style='padding-right:15px;padding-left:15px' scope='col'>Author</th><th style='padding-right:15px;padding-left:15px' scope='col'>List</th><th style='padding-right:15px;padding-left:15px' scope='col'>Year</th><th style='padding-right:15px;padding-left:15px' scope='col'>Genre</th><th scope='col'>Image</th></tr></thead><tbody>"
	for (var i = 0; i < dat.length; i++){
		console.log(dat[i]);
		bookHtml += '<tr><th scope="row">' + dat[i]['title'] + '</th>'
		bookHtml += '<td>' + dat[i]['authors'] + '</td>'
		bookHtml += '<td>' + dat[i]['list'] + '</td>'
		bookHtml += '<td>' + dat[i]['listYear'] + '</td>'
		bookHtml += '<td>' + parseGenres(dat[i]['genre']) + '</td>'
		// bookHtml += '<td>' + dat[i]['publishDate'] + '</td>'
		if (dat[i]['link']){
			bookHtml += '<td>' + dat[i]['link'] + '</td>'
		} else {
			bookHtml += '<td>' + '<a target="_blank" href="https://www.amazon.com/?&_encoding=UTF8&tag=siunami-20&linkCode=ur2&linkId=82d7a2ef7c16ee0a6ef606640c81e435&camp=1789&creative=9325">Find on Amazon</a><img src="//ir-na.amazon-adsystem.com/e/ir?t=siunami-20&l=ur2&o=1" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />' + '</td>'
		}
		bookHtml += '</tr>'
	}
	bookHtml += "</tbody></table>"
	book.html(bookHtml);
}
$(document).ready(function(){
	let listyear = $("#listyear").val();
	let list = $("#list").val();
	let genre = $("#genre").val();
	let defaultParams = [listyear,list,genre];

	let currentURL = window.location.href;
	console.log("\n\n\n\n\n");
	console.log(currentURL);
	var url = new URL(currentURL);
	var urlListYear = url.searchParams.get("listyear");
	var urlList = url.searchParams.get("list");
	var urlGenre = url.searchParams.get("genre");
	
	let urlParams = [urlListYear,urlList,urlGenre];
	console.log(urlParams);
	for (let i = 0; i < urlParams.length; i++){
		if (urlParams[i] == null) {
			urlParams[i] = defaultParams[i];
		}
	}
	console.log(urlParams);


	$.get('/settings', function(dat){
		settings = dat;

		updateSettings1(urlParams[0],urlParams[1],urlParams[2]);
	})
	// let listyear = $("#listyear").val();
	// let list = $("#list").val();
	// let genre = $("#genre").val().replace(/&/g,"%26");




	
	// $.get('/data?listyear=' + listyear + '&list=' + list + '&genre=' + genre, function(dat){
	// 	updateView(dat);
	// })

	// for (var i = 0; i < genres.length; i++){
	// 	$("#genre").append($('<option>', {
	// 	    value: genres[i],
	// 	    text: genres[i]
	// 	}));
	// }

	$("#list").change(function(){
		updateSettings2();
		// getQuery();
	})

	$("#listyear").change(function(){
		updateSettings2();
		// getQuery();
	});

	$("#genre").change(function(){
		updateSettings2();
		// getQuery();
	});

	$( function() {
		$( "#slider-range" ).slider({
		  range: true,
		  min: 2000,
		  max: 2018,
		  values: [ 2000, 2018 ],
		  slide: function( event, ui ) {
		    $( "#amount" ).val(ui.values[ 0 ] + " - " + ui.values[ 1 ] );
		    console.log(ui.values)
		  }
		});
		$( "#amount" ).val($( "#slider-range" ).slider( "values", 0 ) +
		  " - " + $( "#slider-range" ).slider( "values", 1 ) );
	} );
})


// TODO (Multiple lists): if list is selected,
// call a function that removes current elements
// adds elements to filter section
// Adds listeners for elements.
function getQuery(listyear,list,genre){
	console.log(list);
    $.get('/data?listyear=' + listyear + '&list=' + list + '&genre=' + genre.replace(/&/g,"%26"), function(dat){
		updateView(dat);
	})
}





