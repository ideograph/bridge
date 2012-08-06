
$(document).ready(function(){

	socket = io.connect('/bridge');
	window.InventoryController = new function(){

		var category, catSchema;

		var openTotalEditor = function(n)
		{
			for (var i = ALL_SERVICES.length - 1; i >= 0; i--) {
				if (n == ALL_SERVICES[i]['name']) {
					catSchema = ALL_SERVICES[i]; break;
				}
			}
			category = null;
			for (var i = OUR_SERVICES.length - 1; i >= 0; i--){
				if (n == OUR_SERVICES[i]['name']) {
					category = OUR_SERVICES[i]; break;
				}
			};
			$('.modal-inventory fieldset').empty();
			$('.modal-inventory h3').text(capitalize(catSchema.name));
			for (var i=0; i < catSchema.fields.length; i++) {
				var fld = catSchema.fields[i];
				var val = getOrgFieldData(fld);
				var opt = '<label>' + fld;
					opt+= '<input class="input.input-xlarge", type="text", value="'+(val ? val.total : 0)+'", onkeydown="restrictInputFieldToNumbers(event)" />';
					opt+="</label>";
				$('.modal-inventory fieldset').append(opt);
			};
			editor.modal('show');
    	}

		var openAvailEditor = function(n)
		{
			$('#edit-avail .heading').text('Our '+capitalize(n));
			for (var i = OUR_SERVICES.length - 1; i >= 0; i--){
				if (n == OUR_SERVICES[i]['name']) {
					category = OUR_SERVICES[i]; break;
				}
			};
			$('#edit-avail .services').empty();
			for (var i = category.fields.length - 1; i >= 0; i--){
				var f = category.fields[i];
				var s = "<div id='"+f.name+"'class='service' style='display:none'>";
					s+= "<div class='text'>"+capitalize(f.name).replace('-', ' ')+"</div>";
					s+= "<div class='avail'>"+f.avail+' / '+f.total+"</div>";
					s+= "<hr>";
					s+= "<div class='icon'><img src='/img/icons/latest/icon-"+n+"-"+f.name+".png' name='"+n+"' title='"+n+"'/></div>";
					s+= "<div class='icon-del'><i class='icon-minus-sign'></i></div>";
					s+= "<div class='icon-add'><i class='icon-plus-sign'></i></div>";
					s+= "<div class='del' name='"+f.name+"'></div>";
					s+= "<div class='add' name='"+f.name+"'></div></div>";
				$('#edit-avail .services').append(s);
			};
			$('#edit-avail .services .service').each(function(n, o){ $(this).delay(n*100).fadeIn(200); })
			$("#edit-avail .del, .add").hover(onEditAvailOver, onEditAvailOut);
			$("#edit-avail .del, .add").click(onAvailInventoryChange);
			$('#edit-avail').show();
		}
		
		var onEditAvailOver = function(e)
		{
			$(e.currentTarget).fadeTo(200, .15);
		}

		var onEditAvailOut = function(e)
		{
			$(e.currentTarget).fadeTo(200, 0);
		}
		
		var onAvailInventoryChange = function(e)
		{
			var n = $(e.target).attr("class") == 'add' ? 1 : -1;
			var field = $(e.target).attr('name');
			for (var i = category.fields.length - 1; i >= 0; i--){
				if (category.fields[i].name == field) {
					var activeField = category.fields[i]; break;
				}
			};
			if ((activeField.avail == 0 && n == -1) || (activeField.avail == activeField.total) && n == 1) return;
				category.avail = parseInt(category.avail) + n;
				activeField.avail = parseInt(activeField.avail) + n;
			$('#'+activeField.name+' .avail').text(activeField.avail +' / '+activeField.total);
			
		// update the outside world //
			postToSockets();
			postToDatabase();
		}

		var updateInventory = function()
		{
			if (category == null){
				addNewService();
			}	else{
				updateService();
			}
		}
		
		var addNewService = function()
		{
			category = { name : catSchema.name, avail : 0, total : 0, fields : [] };
			$('.modal-inventory label').each(function(i, o){
				var n = $(o).text();
				var v = $(o).find('input').val();
				if (v != 0) category.fields.push({ name : n, avail : 0, total : v });
			});
			category.total = 0;
			for (var i = category.fields.length - 1; i >= 0; i--) category.total += parseInt(category.fields[i].total);
			if (category.total == 0){
				editor.modal('hide');
				removeItemFromView(category.name);
			}	else{
			// update the outside world //
				OUR_SERVICES.push(category);
				postToSockets()
				postToDatabase();
				appendItemToView(category);
			}
		}
		
		var updateService = function()
		{
			$('.modal-inventory label').each(function(i, o){
				var n = $(o).text();
				var v = $(o).find('input').val();
				var f = getOrgFieldData(n);
				if (f){
					if (v != 0){
						f.total = v
					}	else{
						// splice field from category //
						for (var i = category.fields.length - 1; i >= 0; i--) {
							if (category.fields[i].name == n) category.fields.splice(i, 1);
						};
					}
				}	else {
					if (v != 0){
					// field did not previously exist //
						category.fields.push({ name : n, avail : 0, total : v });
					}
				}
			});	
			category.total = 0;
			for (var i = category.fields.length - 1; i >= 0; i--) category.total += parseInt(category.fields[i].total);
			if (category.total == 0){
			//	remove category from org's inventory //
				removeItemFromView(category.name);
				for (var i = OUR_SERVICES.length - 1; i >= 0; i--) if (OUR_SERVICES[i].name == category.name) OUR_SERVICES.splice(i, 1);
			}
		// update the outside world //
			postToSockets()
			postToDatabase();
		}
		
		var getOrgFieldData = function(n)
		{
			if (category){
				for (var i = category.fields.length - 1; i >= 0; i--){
					if (category.fields[i].name == n) return category.fields[i];
				}
			}
		}
		
		var postToSockets = function()
		{
			socket.emit('bridge-event', {name:ORG_NAME, inv:OUR_SERVICES});
			$('#'+category.name+' .avail').text(category.avail +' / '+category.total);
		}
	
		var postToDatabase = function(catName)
		{
			$.ajax({
				url: '/offerings',
				type : "POST",
				data : { inv : category },
				success: function(data){
					editor.modal('hide');
				},
				error: function(jqXHR){
					editor.modal('hide');
					console.log('error', jqXHR.responseText+' :: '+jqXHR.statusText);
				}
			});
		}
		
		var appendItemToView = function(service)
		{
			var s = "<div id='"+service.name+"'class='service'>";
				s+= "<div class='edit' name='"+service.name+"'></div>";
				s+= "<div class='text'>"+capitalize(service.name)+"</div>";
				s+= "<div class='avail'>"+service.avail+' / '+service.total+"</div>";
				s+= "<hr>";
				s+= "<div class='icon' name='"+service.name+"' title='"+service.name+"'><img src='/img/icons/latest/icon-"+service.name+"-general.png'/></div></div>";
			var service = $(s);
			service.find('.edit').click(function(e){ openTotalEditor($(e.target).attr('name')) });
			service.find('.icon').click(function(e){ openAvailEditor($(e.currentTarget).attr('name')) });
			$('#our-services #all .services').append(service);
		}	
		
		var removeItemFromView = function(n)
		{
			$('#our-services #all .services').each(function(i, o){
				var k = $(o);
				if (k.attr('id') == n) k.remove();
			})
		}

		var editor = $('.modal-inventory');
    		editor.modal({ show : false, keyboard : true, backdrop : true });
			editor.on('shown', function() { $('.modal-inventory input')[0].focus(); });
			editor.on('hidden', function() {
				$('html, body').animate({ scrollTop: 0 }, "slow");
			});
		$('#all-services .icon').click(function(e){ openTotalEditor(e.target.name); });
		$('.modal-inventory #submit').click(updateInventory);

		// build our offerings list //
		for (var i = OUR_SERVICES.length - 1; i >= 0; i--) appendItemToView(OUR_SERVICES[i]);
	}
	
});