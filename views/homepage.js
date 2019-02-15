var colors = ["#afbf90","#8ebfbb","#8fafbf","#8fbeaa","#9390bf","#bf8f8f","#bf9b8f"];

var urls = [
	{
		url:'/?listyear=2018&genre=all&list=NY%20Times%20Nonfiction%20Bestseller',
		name: 'NY Times Nonfiction Bestsellers 2018'
	},
	{
		url:'/?listyear=2018&genre=all&list=NY%20Times%20Fiction%20Bestseller',
		name: 'NY Times Fiction Bestsellers 2018'
	},
	{
		url:'/?listyear=2018&genre=all&list=Obama%20Booklist',
		name: "Obama's Booklist 2018"
	},
	{
		url:'/?listyear=2018&genre=all&list=Bill%20Gates%20Booklist',
		name: "Bill Gates' Booklist 2018"
	},
	{
		url:'/?listyear=2018&genre=Best%20of%20the%20Best&list=Good%20Reads%20Choice%20Awards',
		name: "Good Reads Choice Awards Best of the Best 2018"
	},
	{
		url:'/?listyear=2018&genre=Science%20and%20Technology&list=Good%20Reads%20Choice%20Awards',
		name: "Good Reads Choice Awards Science & Technology 2018"
	},
	{
		url:'/?listyear=2018&genre=Poetry&list=Good%20Reads%20Choice%20Awards',
		name: "Good Reads Choice Awards Poetry 2018"
	},
	{
		url:'/?listyear=2018&genre=Nonfiction&list=Good%20Reads%20Choice%20Awards',
		name: "Good Reads Choice Awards Nonfiction 2018"
	}
];

// <a href="/?listyear=2018&genre=all&list=NY%20Times%20Fiction%20Bestseller" class="card text-center" style="color: inherit;text-decoration: none;width: 18rem;height:200px;background-color:#8fbeaa">
//   <div class="card-body">
//     <h4 class="card-title">NY Times Fiction Bestsellers 2018</h5>
//   </div>
// </a>

function makeCard(url,color, title){
	let template = '<a href="'
	template += url
	template += '" class="card text-center" style="color: inherit;text-decoration: none;width: 18rem;height:200px;background-color:'
	template += color + '">'
	template += '<div class="card-body"><h4 class="card-title">'
	template += title
	template += '</h5></div></a>'
	return template
}



$(document).ready(function(){
	$("#cards").html("")
	$("#cards").append('<div id="card-deck-1" class="card-deck"></div>')
	var row = 1;
	var deck = 1;
	for (var i = 0; i < urls.length; i++){
		var color = colors[Math.floor(Math.random()*colors.length)];
		var card = makeCard(urls[i]["url"],color,urls[i]["name"])
		if (row <= 3 && (deck % 2) == 1){
			$("#card-deck-" + deck).append(card);
		} else if (row <= 2 && (deck % 2) == 0){
			$("#card-deck-" + deck).append(card);
		} else {
			row = 1;
			deck += 1;
			$("#cards").append('</br>');
			$("#cards").append('<div id="card-deck-' + deck +  '"class="card-deck"></div>');
			$("#card-deck-" + deck).append(card);
		}
		row++
	}
})


console.log(urls);
console.log(colors);