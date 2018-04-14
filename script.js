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

var statusArray = new Array(numberOfCells);
var cellsArray = new Array(numberOfCells);

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

function posibleMoves(point) {
	// Возвращает список ходов, доступных из данной точки
	var moves = [];
	var i = point[0], j = point[1];
	if (i + 1 < numberOfCells && statusArray[i + 1][j]) 
		moves.push([i + 1, j]);
	if (i - 1 >= 0 && numberOfCells && statusArray[i - 1][j])
		moves.push([i - 1, j]);
	if (j + 1 < numberOfCells && statusArray[i][j + 1])
		moves.push([i, j + 1]);
	if (j - 1 >= 0 && statusArray[i][j - 1]) 
		moves.push([i, j - 1]);
	return moves.sort(movesSortsFunction);
}

function printPosMoves(moves) {
	console.log('posibleMoves');
	for (var el in moves) {
		console.log(moves[el]);
	}
	console.log('--end moves--');
}


function toFindPath() {
	console.log('---toFindPath---');
	// ищет путь до конечной точки в лабиринте
	// возвращает пустой массив в случае, если пути нет
	var startPoint = [numberOfCells - 1, 0]
	var pathArray = [{
			point: startPoint,
			posibleMoves: posibleMoves(startPoint)
		}];
	console.log(pathArray);
	console.log('pathArray');
	console.log(pathArray[0].point);
	console.log(printPosMoves(pathArray[0].posibleMoves));

	return recursiveFindPath(pathArray);
}

function recursiveFindPath(pathArray) {
	console.log('---recursiveFindPath---');
	console.log(pathArray);
	if (false) {
		console.log('Кончился счетчик');
		return -1;}
	// функция рекурсивно ищет путь до нужной точки
	if (pathArray.length == 0) {
		// ходов больше нет
		console.log('ходов больше нет');
		return -1;

	}
	var lastCell = pathArray.slice(-1)[0];
	var lastPosibleMoves = lastCell.posibleMoves;
	if (lastPosibleMoves.length == 0) {
		// зашли в тупик
		// делаем шаг назад
		console.log('зашли в тупик');
		pathArray.pop();
		// $.extend(true, [], pathArray);
		
		return recursiveFindPath($.extend(true, [], pathArray));
	}
	if (distance(lastCell.point, finalPoint) == 0) {
		// путь найден! возвращаем путь
		console.log('ура!');
		var resultPath = [];
		for (var el in pathArray) {
			resultPath.push(el.point);
		}
		return resultPath;
	}
	console.log('Добавляем новую точку');
	console.log('+++++++++++++++++++++++++++++++++++++++');
	console.log('Смотрим, что за безобразие тут творится');
	console.log('Last point ', lastCell.point);
	console.log('Last moves ');
	printPosMoves(lastCell.posibleMoves);
	console.log('+++++++++++++++++++++++++++++++++++++++');
/*	console.log(pathArray);*/
	var newPoint = pathArray[pathArray.length - 1].posibleMoves.shift();
	pathArray[pathArray.length - 1].posibleMoves;
	var newCell = {
		point: newPoint,
		posibleMoves: posibleMoves(newPoint)
	};
	console.log('+++++++++++++++++++++++++++++++++++++++');
	console.log('Смотрим, что за безобразие творится при добавлении новой точки');
	console.log('newPoint ', newCell.point);
	console.log('New moves ');
	printPosMoves(newCell.posibleMoves);
	console.log('+++++++++++++++++++++++++++++++++++++++');	
	pathArray.push(newCell);
	console.log('Возвращаем');
/*	console.log($.extend(true, [], pathArray));*/
	console.log(pathArray.length);
	console.log('ИИИИИИИИИИИИИИИИИИИИИ');
	console.log('ИИИИИИИИИИИИИИИИИИИИИ');
	console.log('Итерация');
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
$(".activeCell").mousedown(function(e) {
	changeClass(e);
	event.preventDefault();
});

$(".activeCell").mouseover(function(e) {
	if (pressed)
		changeClass(e);
});

var finding = false; // флаг который означает, что идет поиск

document.body.onkeypress = function(e) {
	// действие по нажатию enter
	if (e.key == "Enter" && !finding) {
		finding = true;
		refrashStatusArray();
		var arr = [1, 2, 3];
		toFindPath();
/*		var a = [1, 1];
		var b = [1, 1, 2];
		b.pop();
		console.log(distance(a, b) == 0);*/
	}
};