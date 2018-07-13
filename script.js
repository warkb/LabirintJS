// take from css
var findedPath;
var margin = 0; // величина зазора между клетками
var numberOfCells = 12; // количетво клеток в линии
var cellPxSize = 42; // размер клетки в пикселах
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

// флаг, сигнализирующий о том, что анимация идет
var playingAnimation = false;

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

        function doTheLongWork() {
            refrashStatusArray();
            findedPath = toFindPath();
            if (findedPath == null) {
                alert('Пути нет');
                findedPath = [];
            }
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
        cell.style.width = cellPxSize + "px";
        cell.style.height = cellPxSize + "px";
        cell.style.lineHeight = cellPxSize + "px";
        cell.style.cursor = "pointer";
        cellsArray[i][j] = cell;
        mainCellsDiv.appendChild(cell);
    }
}


finalPointId = 'finalPoint';
startPointId = 'startPoint';
finalPointImg = 'img/hous.png';
// cellsArray[numberOfCells - 1][0].appendChild(document.createTextNode('S'));
cellsArray[numberOfCells - 1][0].id = startPointId;
// cellsArray[0][numberOfCells - 1].appendChild(document.createTextNode('F'));
cellsArray[0][numberOfCells - 1].id = finalPointId;
cellsArray[0][numberOfCells - 1].style.backgroundImage  = 'url(' + finalPointImg + ')';

// добавляем div с колобком
var colobok = document.createElement("div");
colobokId = 'divWithColobok';
colobok.id = colobokId;
colobok.style.top = ((numberOfCells - 1) * sizeWithMargin) + "px";
colobok.style.left = 0 + "px";
colobok.style.width = cellPxSize + "px";
colobok.style.height = cellPxSize + "px";
colobok.style.lineHeight = cellPxSize + "px";
mainCellsDiv.appendChild(colobok);

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
    if (playingAnimation) return;
    if (event.target.id == startPointId || event.target.id == finalPointId) 
        return;
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
     * булева типа, обозначающая, можно ли проходить через данный квадрат или нет.
     * Подробнее: https://ru.wikipedia.org/wiki/Алгоритм_Ли
     * :return path: список координат узловых точек пути
     */
    var markedCellsArray = [];
    markedCellsArray.push([startPoint]);
    numMarksArray[startPoint[0]][startPoint[1]] = 0;
    updateNumMarksArray(fieldArray);
    for (var k = 1; k < numberOfCells * numberOfCells; k++) {
        newMarkedCells = [];
        lastMarkedCells = markedCellsArray.slice(-1)[0];

        // для каждой ячейки из предыдущего списка
        for (var i = 0; i < lastMarkedCells.length; i++) {
            var neighbors = getNeighbors(lastMarkedCells[i]);
            for (var indNeigh in neighbors) {
                var neigh = neighbors[indNeigh];
                // если:
                if (
                !containElement(newMarkedCells, neigh) && // элемент ещё не записан
                numMarksArray[neigh[0]][neigh[1]] == -1 && // ячейка ещё не промаркирована
                fieldArray[neigh[0]][neigh[1]] // ячейка свободна для прохождения
                    )
                    {
                        // маркируем ячейку и записываем в массив
                        numMarksArray[neigh[0]][neigh[1]] = k;
                        newMarkedCells.push(neigh);
                    }
            }
        }
        if (newMarkedCells.length == 0) {
            // выхода нет
            return null;
        }
        if (containElement(newMarkedCells, finishPoint)) {
            // путь найден!
            // собираем путь
            var pathArray = [finishPoint];
            for (var i = markedCellsArray.length - 1; i >= 0; i--) {
                var currentLine = markedCellsArray[i];
                for (var j = 0; j < currentLine.length; j++) {
                    if (containElement(getNeighbors(pathArray[0]), currentLine[j])) {
                        pathArray.splice(0, 0, currentLine[j]);
                        break;
                    }
                }
            }
            pathArray.splice(0, 0, startPoint);
            return pathArray;

        }
        markedCellsArray.push(newMarkedCells);
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

function updateNumMarksArray(fieldArray) {
    // обновляет массив числовых меток(numMarksArray) для клеточного поля
    for (var i = 0; i < numberOfCells; i++) {
        for (var j = 0; j < numberOfCells; j++) {
            if (fieldArray[i][j]) 
                numMarksArray[i][j] = -1;
            else
                numMarksArray[i][j] = null;
        }
    }
}

function containElement(array, element) {
    // функция проверяет, содержится ли массив element в массиве array
    for (var indEl in array) {
        if (array[indEl].join(',') == element.join(',')) 
              return true;
    }
    return false;
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
    playingAnimation = true;
    var start = Date.now();
    var frameTime = 300; // время, за которое анимация сдвинется на один кадр
    var fullTime = frameTime * (path.length + 1);
    var timer = setInterval(function () {
        var timePassed = Date.now() - start;
        var currentFrame = Math.ceil(timePassed / frameTime);

        if (currentFrame >= path.length) {
            clearInterval(timer);
            playingAnimation = false;
            colobok.style.top = ((numberOfCells - 1) * sizeWithMargin) + "px";
            colobok.style.left = 0 + "px";
            return;
        }
        var currentCellCoord = path[currentFrame];
        var currentCell = cellsArray[currentCellCoord[0]][currentCellCoord[1]];
        colobok.style.top = currentCell.style.top;
        colobok.style.left = currentCell.style.left;
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