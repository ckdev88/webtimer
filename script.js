// build a timer, tasks and later a sort of agenda function for the day, connected with times, all using local storage, not needing any deployment server, just the html, js & css maybe even all in one html-file, so it's super easy to use.

// HMTL Elements
const task_new_btn = document.getElementById("task_new_btn");
const task_new_form = document.getElementById("task_new_form");
const task_new_quick = document.getElementById("task_new_quick");
const task_container = document.getElementById("task_container");
/*
html element id's:
task_new_form
task_id
new_task_name
new_task_description
new_task_interval
task_start_now
task_new_quick
task_container
*/

function newTaskSubmit() {
	task_new_form.addEventListener("submit", (e) => {
		e.preventDefault();
		var data = new FormData(document.getElementById("task_new_form"));
		// console.log(data.get('task_start_now'));
		addTask(
			data.get("task_name"),
			data.get("task_description"),
			data.get("task_interval"),
		);

		document.getElementById("new_task_name").value = "";
		document.getElementById("new_task_description").value = "";
		document.getElementById("new_task_interval").value = "";
		// data.delete('task_name');
	});
}
newTaskSubmit();

function addTask(name, description, interval) {
	if (name) {
		// get item timerTasks
		let timerArr = [];
		timerArr = JSON.parse(localStorage.getItem("timerTasks"));
		// console.log(timerArr);

		// push into item timerTasks
		timerArr.push({
			name: name,
			description: description,
			interval: interval,
			task: "task-" + name.replaceAll(' ', ''),
		});

		// set item timerTasks
		localStorage.setItem("timerTasks", JSON.stringify(timerArr));
		let timerArr2 = JSON.parse(localStorage.getItem("timerTasks"));
		renderTasks(timerArr2);
	}
}

function detectQuickTask() {
	if (document.getElementById("task-Stretch")) {
		task_new_quick.className = "dnone";
	} else task_new_quick.className = "dblock";
}

let startArr = [];
localStorage.setItem("timerTasks", JSON.stringify(startArr));

let getTimerTasksArr = JSON.parse(localStorage.getItem("timerTasks"));

// ADD TASKS
let tasks = [];
// Add task
// properties:
//	id<int><auto-increment><hidden>
//	name<string><required>
//	description<string><optional>
//	start<string><HH:MM>/Now<required>, default=Now
//	interval (minutes)<int>, default=false

localStorage.setItem("taken", JSON.stringify(tasks));

// use quick add function so have a base setup, using all basic fields and characteristics
task_new_quick.addEventListener("click", () => {
	addQuickTask();
	detectQuickTask();

	// TODO: check on name if not exists to prevent duplicates
	// getTimerTasksArr.push({
	// 	name: 'stretch',
	// 	description: 'Even lopen, strekken, eten, niets superactiefs',
	// 	interval: 35,
	// });
	// localStorage.setItem('timerTasks', JSON.stringify({
	// 	getTimerTasksArr
	// }));
	// console.log(getTimerTasksArr);
	// console.log(getTimerTasksArr.length);
	//

	// TODO: verwijs naar functie die de update uitvoert, ipv bovenstaand
});

//hide quick add button when there a quickly addes task already exists

function renderTasks(getTimerTasksArr) {
	task_container.innerHTML = "";
	// for (const i of getTimerTasksArr) {
	// 	console.log(i);
	// 	task_container.appendChild(renderTask(i));
	// }
	for (let i = 0; i < getTimerTasksArr.length; i++) {
		console.log(getTimerTasksArr[i]);
		task_container.appendChild(renderTask(getTimerTasksArr[i], i));
	}
}

function renderTask(i, key) {
	let el = document.createElement("div");
	el.className = "task";
	el.id = i.task;
	el.appendChild(renderTaskElement("h3", "task-name", i.name));
	el.appendChild(renderTaskElement("div", "task-description", i.description));
	el.appendChild(renderTaskElement("div", "task-countdown-total", i.interval));
	el.appendChild(renderTaskElement('div', 'task-countdown-current', countdownTimer(i.interval, 'countdown-' + i.task), 'countdown-' + el.id));
	el.appendChild(removeTaskLink(i.name.replaceAll(' ', '')));
	return el;
}

function renderTaskElement(node = "div", className, content, id = '') {
	let taskEl = document.createElement(node);
	taskEl.className = className;
	taskEl.innerHTML = content;
	taskEl.id = id;
	return taskEl;
}

function addQuickTask() {
	// get item timerTasks
	let timerArr = [];
	timerArr = JSON.parse(localStorage.getItem("timerTasks"));
	// console.log(timerArr);

	timerArr.push({
		name: "Stretch",
		description: "Quick timer",
		interval: 35,
		task: "task-Stretch",
	});

	// set item timerTasks
	localStorage.setItem("timerTasks", JSON.stringify(timerArr));
	let timerArr2 = JSON.parse(localStorage.getItem("timerTasks"));
	renderTasks(timerArr2);
}

function removeTaskLink(id) {
	let el = document.createElement("button");
	el.innerHTML = "remove task";
	el.className = "text";
	el.className += " teeee";
	el.id = 'del-' + id;
	console.log(el.id);
	el.addEventListener("click", () => {
		removeTask('task-' + id);
		detectQuickTask();
	});
	return el;
}

function removeTask(task) {
	let arr = JSON.parse(localStorage.getItem("timerTasks"));
	arr = arr.filter(function(el) {
		return el.task !== task;
	});
	localStorage.setItem("timerTasks", JSON.stringify(arr));
	renderTasks(arr);
}

function updateTasks(from, to) {
	console.log("update tasks...");
}

updateTasks(JSON.parse(localStorage.getItem("timerTasks")));

// - Countdown timer
// - Button: if interval==false: DONE, if interval==true: RESET

// Show New task-form if tasks array is empty
if (getTimerTasksArr.length === 0) task_new_form.className = "dblock";

// let button #new_task_btn toggle the form #new_task_form
// TODO: temporarily commented 
// task_new_btn.addEventListener("click", () => {
//
// 	!task_new_form.checkVisibility()
// 		? (task_new_form.className = "dblock")
// 		: (task_new_form.className = "dnone");
// });

function countdownTimer(limit, id, currentCount = 0) {

	let trigger = setInterval((sec = limit, id = '') => {
		currentCount = timer(currentCount);
		if (currentCount === sec) { stopIntervalObj(trigger); }
	}, 1000);

	function timer(next = 0) {
		next += 1;
		document.getElementById(id).innerHTML = next;
		console.log(id);
		return next;
	}
	// return 0; // default value
}

function stopIntervalObj(obj) {
	clearInterval(obj);
}
