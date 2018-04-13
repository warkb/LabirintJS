// take from css
var margin = 5; // величина зазора между клетками
var numberOfCells = 10; // количетво клеток
var cellPxSize = 50; // размер клетки в пикселах
var sizeWithMargin = cellPxSize + margin;
var firstLeft = (document.body.clientWidth - sizeWithMargin * numberOfCells + 
	margin) / 2;
var firstTop = (document.body.clientHeight - sizeWithMargin * numberOfCells +
	margin) / 2;

var activeCellClassName = "activeCell";
var notActiveCellClassName = "notActiveCell";

console.log("firstLeft ", firstLeft);
console.log("firstTop ", firstTop);

var statusArray = new Array(numberOfCells);
var cellsArray = new Array(numberOfCells);

for (var i = 0; i < numberOfCells; i++) {
	statusArray[i] = new Array(numberOfCells);
	cellsArray[i] = new Array(numberOfCells);
}

for (var i = 0; i < numberOfCells; i++) {
	for (var j = 0; j < numberOfCells; j++) {
		var cell = document.createElement("div");
		cell.className = activeCellClassName;
		cell.style.top = (firstTop + i * sizeWithMargin) + "px";
		/*console.log("top: ", cell.top);*/
		cell.style.left = (firstLeft + j * sizeWithMargin) + "px";
		/*console.log("left: ", cell.left);*/
		cellsArray[i][j] = cell;
		document.body.appendChild(cell);
	}
}

// добавляем смену класса при перетаскивании мышью с зажатой левой кнопкой
var pressed = false;

document.body.onmousedown = function () {
	pressed = true;
	event.preventDefault();
}

document.body.onmouseup = function () {
	pressed = false;
}

function refrashStatusArray() {
	// обновляет массив статусов согласно текущему массиву клеток
	for (var i = 0; i < numberOfCells; i++) {
		for (var j = 0; j < numberOfCells; j++) {
			statusArray[i][j] = cellsArray[i][j].className == activeCellClassName;
		}
	}
}

function changeClass(event) {
	// функция меняет статус ечейки с активной на неактивную
	if (event.target.className == notActiveCellClassName) {
		event.target.className = activeCellClassName;
	}
	else {
		event.target.className = notActiveCellClassName;
	}
}

function distance(a, b) {
	// получает на вход два двумерных массива с точками, 
	// возвращает дистанцию между точками
	return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
}
$(".activeCell").mousedown(function(e) {
	changeClass(e);
	event.preventDefault();
});

$(".activeCell").mouseover(function(e) {
	if (pressed)
		changeClass(e);
});

document.body.onkeypress = function(e) {
	// действие по нажатию enter
	if (e.key == "Enter") {
		refrashStatusArray();
		console.log(statusArray1);
	}
};