// take from css
var findedPath;
var margin = 5; // величина зазора между клетками
var numberOfCells = 9; // количетво клеток в линии
var cellPxSize = 50; // размер клетки в пикселах
var sizeWithMargin = cellPxSize + margin;
var maxCounter = 15000; // максимальное количество итераций поиска
var firstLeft = (document.body.clientWidth - sizeWithMargin * numberOfCells + 
	margin) / 2;
var firstTop = (document.body.clientHeight - sizeWithMargin * numberOfCells +
	margin) / 2;

var waitscreenObject = document.getElementById('waitscreen');

var baseCellColor = "#54f4f4";

var highlitedCellColor = "rgb(255,219,77)";
var activeCellClassName = "activeCell";
var notActiveCellClassName = "notActiveCell";
var mainCellsDivClass = 'mainCellsDiv';

var statusArray = new Array(numberOfCells); 
var cellsArray = new Array(numberOfCells);
var numMarksArray = new Array(numberOfCells); // массив числовых меток для всех ячеек

for (var i = 0; i < numberOfCells; i++) {
	statusArray[i] = new Array(numberOfCells);
	cellsArray[i] = new Array(numberOfCells);
	numMarksArray[i] = new Array(numberOfCells);
}

var finding = false; // флаг который означает, что идет поиск
var stopFlag = false; // флаг который означает, что кнопка стоп была нажата

function sleep(ms) {
	ms += new Date().getTime();
	while (new Date() < ms){}
}


function onEnter(e) {
	// действие по нажатию enter
	if ((e.key == "Enter" || e.key == undefined) && !finding) {
		finding = true;
		waitscreenObject.setAttribute('style', 'top: 0px;');

		function doTheLongWork() {
			refrashStatusArray();
			findedPath = toFindPath();
			console.log(findedPath);
		}
		try {
			setTimeout(doTheLongWork, 0);
		}
		catch(e) {
			findedPath = [];
			alert('Ошибка: ' + e);
		}
		setTimeout('if (findedPath.length > 0) playAnimation(findedPath);', 0);
	}

	finding = false;
};

// добавляем кнопку поиска пути
goButton = document.getElementById("goButton");
goButton.onclick = onEnter;

document.getElementById('info').appendChild(goButton);
firstTop += 40;

var finalPoint = [0, numberOfCells - 1];


// добавляем ячейки на экран
var mainCellsDiv = document.createElement("div");
mainCellsDiv.className = mainCellsDivClass;
mainCellsDiv.style.width = sizeWithMargin * numberOfCells + "px";
document.getElementById('info').appendChild(mainCellsDiv);

for (var i = 0; i < numberOfCells; i++) {
	for (var j = 0; j < numberOfCells; j++) {
		var cell = document.createElement("div");
		cell.className = activeCellClassName;
		cell.style.top = (i * sizeWithMargin) + "px";
		cell.style.left = (j * sizeWithMargin) + "px";
		cellsArray[i][j] = cell;
		cell.appendChild(document.createTextNode(i + ', ' + j));
		mainCellsDiv.appendChild(cell);
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


// далее идут функции, ответственные за поиск пути в лабиринте

var resultPath = [];

function IJnotInResultPath(i, j) {
	// возвращает true если точка с координатами i,j не принадлежит пути
	for (var ind in resultPath) {
		var element = resultPath[ind];
		if (element[0] == i && element[1] == j) {
			return false;
		}
	}
	return true;
}

function posibleMoves(point) {
	// Возвращает список ходов, доступных из данной точки
	var moves = [];
	var i = point[0], j = point[1];
	if (i + 1 < numberOfCells && statusArray[i + 1][j] && IJnotInResultPath(i + 1, j)) 
		moves.push([i + 1, j]);
	if (i - 1 >= 0 && numberOfCells && statusArray[i - 1][j] && IJnotInResultPath(i - 1, j))
		moves.push([i - 1, j]);
	if (j + 1 < numberOfCells && statusArray[i][j + 1] && IJnotInResultPath(i, j + 1))
		moves.push([i, j + 1]);
	if (j - 1 >= 0 && statusArray[i][j - 1] && IJnotInResultPath(i, j - 1)) 
		moves.push([i, j - 1]);
	return moves.sort(movesSortsFunction);
}

function toFindPath() {
	// ищет путь до конечной точки в лабиринте
	// возвращает пустой массив в случае, если пути нет
	counter = 0;
	var startPoint = [numberOfCells - 1, 0];
	var finishPoint = [0, numberOfCells - 1];
	return toFindPathByWaveMethood(statusArray, startPoint, finishPoint);
}


function toFindPathByWaveMethood(fieldArray, startPoint, finishPoint) {
	/* Ищет путь из точки startPoint в точку finishPoint 
	 * fieldArray представляет собой двумерный список, заполненный переменными
	 * булева типа, обозначающая, можно ли проходить через данный квадрат или нет
	 * :return path: список координат узловых точек пути
	 */
	var markedCellsArray = [];
	markedCellsArray.push(startPoint);
	for (var k = 0; k < numberOfCells * numberOfCells; k++) {
		newMarkedCells = [];
		lastMarkedCells = markedCellsArray.slice(-1)[0];

		// для каждой ячейки из предыдущего списка
		for (var i = 0; i < lastMarkedCells.length; i++) {
			(lastMarkedCells[i])
		}
	}
}

function getNeighbors(point) {
	var x, y, newX, newY;
	x = point[0];
	y = point[1];
	var neighbors = [];
	for (var i = -1; i < 2; i++) {
		newX = x + i;
		if (newX < 0 || newX > numberOfCells - 1) 
			continue;
		for (var j = -1; j < 2; j++) {
			newY = y + j;
			if (newY < 0 || newY > numberOfCells - 1) 
				continue;
			if (Math.abs(i) == Math.abs(j)) 
				continue;
			neighbors.push([newX, newY]);
		}
	}
	return neighbors;
}

function movesSortsFunction(a, b) {
	// вспомогательная функция для сортировки массива
	var distanceToA = distance(a, finalPoint);
	var distanceToB = distance(b, finalPoint);
	if (distanceToA == distanceToB) 
		return 0;
	if (distanceToA < distanceToB) 
		return 0-1;
	else
		return 1;
}

function distance(a, b) {
	// получает на вход два двумерных массива с точками, 
	// возвращает дистанцию между точками
	return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
}

function playAnimation(path) {
	// отображает полученный путь в виде анимации
	var start = Date.now();
	var frameTime = 300; // время, за которое анимация сдвинется на один кадр
	var fullTime = frameTime * (path.length + 1);
	var prevHighlatedCell = undefined;
	var timer = setInterval(function () {
		var timePassed = Date.now() - start;
		var currentFrame = Math.ceil(timePassed / frameTime);
		if (prevHighlatedCell) {
			prevHighlatedCell.style.backgroundColor = "";
		}
		if (currentFrame >= path.length) {
			clearInterval(timer);
			return;
		}
		var currentCellCoord = path[currentFrame];
		var currentCell = cellsArray[currentCellCoord[0]][currentCellCoord[1]];
		currentCell.style.backgroundColor = highlitedCellColor;
		prevHighlatedCell = currentCell;
	});
}

$(".activeCell").mousedown(function(e) {
	changeClass(e);
	event.preventDefault();
});

$(".activeCell").mouseover(function(e) {
	if (pressed)
		changeClass(e);
});

document.body.onkeypress = onEnter;