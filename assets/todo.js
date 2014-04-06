/*
 * @author Shaumik "Dada" Daityari
 * @copyright December 2013
 */

/* Some info
 Using newer versions of jQuery and jQuery UI in place of the links given in problem statement
 All data is stored in local storage
 User data is extracted from local storage and saved in variable data
 Otherwise, comments are provided at appropriate places
 */

var todo = todo || {};

(function (todo, $) {

	var defaults = {
			 todoTask: "todo-task",
			 todoHeader: "task-header",
			 todoDate: "task-date",
			 todoDescription: "task-description",
			 taskId: "task-",
			 formId: "todo-form",
			 dataAttribute: "data",
			 deleteDiv: "delete-div"
		 }, codes = {
			 "1": "#pending",
			 "2": "#inProgress",
			 "3": "#completed"
		 },

		 data = {},
		 order = {};


	todo.init = function (options) {

		options = options || {};
		options = $.extend({}, defaults, options);

		loadAllData();

		// go through list of items and create them
		$.each(order, function (index, params) {
			generateElement(data[params]);
		});

		// Adding codes to each category of tasks
		$.each(codes, function (index, value) {
			$(value).data("code", index);
		});

		// Create Sortable List and connect them
		$(".sortable").sortable(
			 {
				 start: function (e, ui) {
					 // set placeholder to height of dragged element
					 ui.placeholder.height(ui.item.height());
				 },

				 stop: function (event, ui) {

					 var element = ui.item,
						  css_id = element.attr("id"),
						  id = css_id.replace(options.taskId, ""),
						  object = data[id];

					 // check if target is delete-box and remove element
					 if (ui.item.parent().attr("id") === "delete-div") {
						 ui.item.remove();
						 removeElement(id);
					 }

					 else {

						 // Changing object code
						 object.code = ui.item.parent().data("code");
						 data[id] = object;
					 }

					 saveData();

				 }}).sortable("option", {"connectWith": ".sortable", "opacity": 0.9}).disableSelection();

	};

	// Add Task
	var generateElement = function (params) {
		var parent = $(codes[params.code]),
			 wrapper;

		if (!parent) {
			return;
		}

		wrapper = $("<li ></li>", {
			"class": defaults.todoTask,
			"id": defaults.taskId + params.id,
			"data": params.id
		}).appendTo(parent);

//        $("<span />", {
//            "class" : "ui-icon ui-icon-circle-minus pull-right"
//          }).appendTo(wrapper);

		$("<p ></p>", {
			"class": defaults.todoDate,
			"text": params.date
		}).appendTo(wrapper);

		$("<p ></p>", {
			"class": defaults.todoHeader,
			"text": params.title
		}).appendTo(wrapper);


		$("<p ></p>", {
			"class": defaults.todoDescription,
			"html": params.description.replace(new RegExp('\r?\n', 'g'), '<br />')
		}).appendTo(wrapper);

		saveData();

	};

	// Remove task
	var removeElement = function (params) {
		delete data[params];
	};

	todo.add = function () {
		var inputs = $("#" + defaults.formId + " :input"),
			 errorMessage = "Title can not be empty",
			 id, title, description, date, tempData;

		if (inputs.length !== 4) {
			return;
		}

		title = inputs[0].value;
		description = inputs[1].value;
		date = inputs[2].value;

		if (!title) {
			generateDialog(errorMessage);
			return;
		}

		id = new Date().getTime();

		//noinspection MagicNumberJS
		tempData = {
			id: id,
			position: 999,
			code: "1",
			title: title,
			date: date,
			description: description
		};

		// Saving element in local storage
		data[id] = tempData;
		// Generate Todo Element
		generateElement(tempData);
		// Reset Form
		inputs[0].value = "";
		inputs[1].value = "";
		inputs[2].value = "";
	};

	var generateDialog = function (message) {
		var responseId = "response-dialog",
			 title = "Message",
			 responseDialog = $("#" + responseId),
			 buttonOptions;

		if (!responseDialog.length) {
			responseDialog = $("<div ></div>", {
				title: title,
				id: responseId
			}).appendTo($("body"));
		}

		responseDialog.html(message);

		buttonOptions = {
			"Ok": function () {
				responseDialog.dialog("close");
			}
		};

		//noinspection MagicNumberJS
		responseDialog.dialog({
			autoOpen: true,
			width: 400,
			modal: true,
			closeOnEscape: true,
			buttons: buttonOptions
		});
	};

	todo.clear = function () {
		data = {};
		order = {};
		$("." + defaults.todoTask).remove();
		saveData();
	};

	todo.debug = function () {
	};

	var loadAllData = function () {

		data = JSON.parse(localStorage.getItem("todoData")) || {};
		order = JSON.parse(localStorage.getItem("todoOrder")) || {};

	};

	var saveData = function () {

		$(order).empty();
		localStorage.setItem("todoData", JSON.stringify(data));
		$('.todo-task').each(function (index) {
			order[index] = $(this).attr("id").replace(defaults.taskId, "");

		});
		localStorage.setItem("todoOrder", JSON.stringify(order));
		todo.debug();

	};


})(todo, jQuery);