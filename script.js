// take from css
var margin = 5; // величина зазора между клетками
var numberOfCells = 9; // количетво клеток в линии
var cellPxSize = 50; // размер клетки в пикселах
var sizeWithMargin = cellPxSize + margin;
var firstLeft = (document.body.clientWidth - sizeWithMargin * numberOfCells + 
	margin) / 2;
var firstTop = (document.body.clientHeight - sizeWithMargin * numberOfCells +
	margin) / 2;


var baseCellColor = "#54f4f4";

var highlitedCellColor = "rgb(255,219,77)";
var activeCellClassName = "activeCell";
var notActiveCellClassName = "notActiveCell";

var statusArray = new Array(numberOfCells);
var cellsArray = new Array(numberOfCells);

var finding = false; // флаг который означает, что идет поиск

function onEnter(e) {
	// действие по нажатию enter
	if ((e.key == "Enter" || e.key == undefined) && !finding) {
		finding = true;
		refrashStatusArray();
		var arr = [1, 2, 3];
		var findedPath = toFindPath();
		console.log(findedPath);
		if (findedPath.length > 0) 
			playAnimation(findedPath);
	}

	finding = false;
};

// добавляем кнопку поиска пути
goButton = document.getElementById("goButton");
goButton.onclick = onEnter;

// goButton.style.top = firstTop + (numberOfCells - 1) * sizeWithMargin + "px";
// goButton.style.left = firstLeft + (numberOfCells) * sizeWithMargin + 'px';

document.getElementById('info').appendChild(goButton);
firstTop += 40;//document.getElementById('info').style.height;

var finalPoint = [0, numberOfCells - 1];


for (var i = 0; i < numberOfCells; i++) {
	statusArray[i] = new Array(numberOfCells);
	cellsArray[i] = new Array(numberOfCells);
}

for (var i = 0; i < numberOfCells; i++) {
	for (var j = 0; j < numberOfCells; j++) {
		var cell = document.createElement("div");
		cell.className = activeCellClassName;
		cell.style.top = (firstTop + i * sizeWithMargin) + "px";
		cell.style.left = (firstLeft + j * sizeWithMargin) + "px";
		cellsArray[i][j] = cell;
		cell.appendChild(document.createTextNode(i + ', ' + j));
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
	resultPath = [];
	console.log('---toFindPath---');
	// ищет путь до конечной точки в лабиринте
	// возвращает пустой массив в случае, если пути нет
	counter = 0;
	var startPoint = [numberOfCells - 1, 0]
	var pathArray = [{
			point: startPoint,
			posibleMoves: posibleMoves(startPoint)
		}];
	resultPath.push(startPoint);
	return recursiveFindPath(pathArray);
}

function recursiveFindPath(pathArray) {
	console.log('---recursiveFindPath---');
	counter += 1;
	// функция рекурсивно ищет путь до нужной точки
	if (pathArray.length == 0) {
		// ходов больше нет
		console.log('ходов больше нет');
		console.log('Counter: ', counter);
		return -1;
	}

	if (resultPath.length > 100) {return -1;}
	var lastCell = pathArray.slice(-1)[0];
	var lastPosibleMoves = lastCell.posibleMoves;
	if (lastPosibleMoves.length == 0) {
		// зашли в тупик
		// делаем шаг назад
		console.log('зашли в тупик');
		pathArray.pop();
		resultPath.pop();
		// $.extend(true, [], pathArray);
		
		return recursiveFindPath($.extend(true, [], pathArray));
	}
	if (distance(lastCell.point, finalPoint) == 0) {
		// путь найден! возвращаем путь
		console.log('ура!');
		return resultPath;
	}

	var newPoint = pathArray[pathArray.length - 1].posibleMoves.shift();
	pathArray[pathArray.length - 1].posibleMoves;
	var newCell = {
		point: newPoint,
		posibleMoves: posibleMoves(newPoint)
	};
	pathArray.push(newCell);
	resultPath.push(newPoint);
	return recursiveFindPath($.extend(true, [], pathArray));
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