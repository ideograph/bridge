function getInventory()
{
	return  [	{name : 'housing', avail : 200, total : 400, fields :
					[ 	{name :'general', avail : 50, total : 100},
						{name :'individual', avail : 50, total : 100},
						{name :'long-term', avail : 50, total : 100},
						{name :'special-needs', avail : 50, total : 100} ] },
				{name : 'health', avail : 200, total : 400, fields :
					[ 	{name :'general', avail : 50, total : 100},
						{name :'critical', avail : 50, total : 100},
						{name :'illness', avail : 50, total : 100},
						{name :'ongoing', avail : 50, total : 100} ] },
				{name : 'meals', avail : 200, total : 400, fields :
					[ 	{name :'general', avail : 50, total : 100},
						{name :'breakfast', avail : 50, total : 100},
						{name :'lunch', avail : 50, total : 100},
						{name :'dinner', avail : 50, total : 100} ] },
				{name : 'hygiene', avail : 150, total : 300, fields :
					[ 	{name :'general', avail : 50, total : 100},
						{name :'attire', avail : 50, total : 100},
						{name :'shower', avail : 50, total : 100} ] },
	 		]
}

module.exports.orgs = [
	{	inv		: getInventory(),
		name 	: 'Glide Memorial',
		addy1 	: '330 Ellis Street',
		addy2 	: '',
		city	: 'San Francisco',
		state 	: 'California',
		phone	: '415.674.6000',
		website	: 'http://glide.org' },
	{	inv		: getInventory(),
		name 	: 'Next Door',
		addy1 	: '1001 Polk Street',
		addy2 	: '',
		city	: 'San Francisco',
		state 	: 'California',
		phone	: '415.292.2180',
		website	: '' },
	{	inv		: getInventory(),
		name 	: 'Episcopal Sanctuary',
		addy1 	: '201 Eighth Street',
		addy2 	: '',
		city	: 'San Francisco',
		state 	: 'California',
		phone	: '415.863.3893',
		website	: '' },
	{	inv		: getInventory(),
		name 	: 'Hospitality House',
		addy1 	: '146 Leavenworth Street',
		addy2 	: '',
		city	: 'San Francisco',
		state 	: 'California',
		phone	: '415.749.2103',
		website	: '' },
	{	inv		: getInventory(),
		name 	: 'Dolores Street - Santa Ana',
		addy1 	: '2909 24th Street',
		addy2 	: '',
		city	: 'San Francisco',
		state 	: 'California',
		phone	: '415.821.2798',
		website	: '' }
]

module.exports.usrs = [
	{	org		: 'Glide Memorial',
		name 	: 'admin',
		pos		: 'admin',
		phone 	: '415-333-3333',
		email	: 'glide@bridge.org',
		passw	: 'sfbridge' },
	{	org		: 'Next Door',
		name 	: 'admin',
		pos		: 'admin',
		phone 	: '415-333-3333',
		email	: 'nextdoor@bridge.org',
		passw	: 'sfbridge' },
	{	org		: 'Episcopal Sanctuary',
		name 	: 'admin',
		pos		: 'admin',
		phone 	: '415-333-3333',
		email	: 'epis@bridge.org',
		passw	: 'sfbridge' },
	{	org		: 'Hospitality House',
		name 	: 'admin',
		pos		: 'admin',
		phone 	: '415-333-3333',
		email	: 'hh@bridge.org',
		passw	: 'sfbridge' },
	{	org		: 'Dolores Street - Santa Ana',
		name 	: 'admin',
		pos		: 'admin',
		phone 	: '415-333-3333',
		email	: 'dolores@bridge.org',
		passw	: 'sfbridge' }
]

module.exports.clients = [
	{	fname			: 'John',
		lname			: 'Doe',
		gender			: 'Male',
		ethnicity 		: 'African American',
		birthMonth		: '1',
		birthDay		: '1',
		birthYear		: '1976',
		social			: '888-88-8888',
		language		: 'English',
		heightFeet		: '5',
		heightInches	: '11',
		eyeColor		: 'Brown',
		veteran			: 'Yes',
		disabled		: 'No',
		tuberculous		: 'No' },
	{	fname			: 'Jane',
		lname			: 'Doe',
		gender			: 'Female',
		ethnicity 		: 'White',
		birthMonth		: '1',
		birthDay		: '1',
		birthYear		: '1976',
		social			: '888-88-8888',
		language		: 'Spanish',
		heightFeet		: '5',
		heightInches	: '7',
		eyeColor		: 'Green',
		veteran			: 'No',
		disabled		: 'Yes',
		tuberculous		: 'No' }
]