import pygame
import sys
import random
from pygame.locals import *
from math import sqrt
from time import sleep
from copy import deepcopy


pathToFile_TO_FIELD = 'field.txt'
START_MARK = 's'
FINISH_MARK = 'f'
BLOCK_MARK = 'b'
SPACE_MARK = '.'
PATH_MARK = 'x'

# для графического интерфейса
SIZE_OF_CELL = 35  # величина клетки в пикселах
MARGIN = 5  # зазор между клетками
HEIGHT = 12
WIDTH = 12
NOCELL = (None, None)

WINDOWWIDTH = 900
WINDOWHEIGHT = 600

NUMARRAY = []

START = (0, HEIGHT - 1)
HERO = START  # координаты желтого кружка
FINISH = (WIDTH - 1, 0)

XMARGIN = (WINDOWWIDTH - (MARGIN + SIZE_OF_CELL) * WIDTH + MARGIN) / 2
YMARGIN = (WINDOWHEIGHT - (MARGIN + SIZE_OF_CELL) * HEIGHT + MARGIN) / 2

CAPTION = 'Поиск пути'
FULLSELLSIZE = SIZE_OF_CELL + MARGIN
FULLXSIZE = FULLSELLSIZE * WIDTH
FULLYSIZE = FULLSELLSIZE * HEIGHT

BGCOLOR = (106, 143, 214)
BALLCOLOR = (255, 255, 0)
TARGETCOLOR = (255, 0, 0)

FREECELLCOLOR = (255, 255, 255)
LOCKCELLCOLOR = (59, 80, 119)

BASEFONTSIZE = 20

WALKSTATE = 'WALK'
SETSTATE = 'SET'

ALERTFONTSIZE = 40


class Task():
    """В этом классе будет создаваться
    и решаться задача поиска пути"""

    def __init__(self, pathToFile, initArray, start, finish):
        self.start = start
        self.finish = finish
        self.fieldArr = []
        self.path = []
        for i in range(len(initArray)):
            lineArr = initArray[i]
            lineCur = []
            for j in range(len(lineArr)):
                lineCur.append((i, j, initArray[j][i]))
            self.fieldArr.append(lineCur)
        self.height = len(self.fieldArr)
        self.width = len(self.fieldArr[0])
        return

    def __str__(self):
        string = ''
        if self.path == []:
            string += 'Путь не найден(может и не искали)\n'
        for i in range(self.height):
            for j in range(self.width):
                if self.inPath(i, j):
                    string += PATH_MARK
                elif self.start[0] == i and self.start[1] == j:
                    string += START_MARK
                elif self.finish[0] == i and self.finish[1] == j:
                    string += FINISH_MARK
                elif self.fieldArr[i][j][2] == False:
                    string += BLOCK_MARK
                else:
                    string += ' '
            string += '\n'
        return string

    def inPath(self, i, j):
        for cell in self.path:
            if i == cell[0] and j == cell[1]:
                return True
        return False

    def solveByWaveAlgorithm(self):
        global NUMARRAY
        """поиск пути с помощью волнового алгоритма"""
        """
        создаем числовой массив размером с поле, где свободные ячейки 
        будут обозначаться через -1, а заблокированные для прохождения через None
        создаем пустой массив который будет содержать информацию о ранее 
        пронумерованных ячейках
        В ячейку, соответствующую стартовой ставим 0
        Добавляем её в список ранее пронумерованных
        Далее в цикле:
            Создаем список ячеек, соседних по отношению к каждой последней пронумерованной,
            не являющихся пронумерованными или заблокированными
            Если список пуст, значит пути нет - возвраем None
            Если список содержит финишную ячейку - значит путь найден. Прерываем цикл
            Добавляем этот список в массив ранее пронумерованных ячеек.
        С помощью массива ранее пронумерованных ячеек восстанавливаем путь и 
        возвращаем его        
        """
        numArray = [[-1 if self.fieldArr[i][j][2] else None
                     for j in range(self.width)]
                    for i in range(self.height)]
        # список с ранее пронумерованными ячейками
        lastMarkedLists = [[self.start]]
        i, j = self.start
        numArray[i][j] = 0

        def getNeighbors(cell, noMarkCheck=False):
            """возвращает все еще не отмеченные и свободные соседние клетки"""
            output = []
            for di in [-1, 0, 1]:
                ni, nj = cell
                if not(0 <= ni + di < self.height):
                    continue
                for dj in [-1, 0, 1]:
                    if not(0 <= nj + dj < self.width):
                        continue
                    if abs(di) == abs(dj):
                        continue
                    if numArray[ni + di][nj + dj] == -1 or noMarkCheck:
                        output.append((ni + di, nj + dj))
            return output
        for k in range(max(self.width, self.height) *
                       max(self.width, self.height)):
            listToMark = []
            for cell in lastMarkedLists[-1]:
                for neighCell in getNeighbors(cell):
                    if not neighCell in listToMark:
                        listToMark.append(neighCell)
            if listToMark == []:
                # доступных ячеек для разметки больше нет
                # путь не найден
                NUMARRAY = lastMarkedLists
                return None
            for cell in listToMark:
                numArray[cell[0]][cell[1]] = k + 1
            if self.finish in listToMark:
                # путь нашли!
                break
            lastMarkedLists.append(listToMark)

        else:
            raise BaseException('Слишком много итераций цикла')
        # собираем путь
        path = [self.finish]
        for line in reversed(lastMarkedLists):
            for cell in line:
                if cell in getNeighbors(path[0], True):
                    path.insert(0, cell)
                    break
        NUMARRAY = lastMarkedLists
        return path

    def solveByAAsteric(self):
        """поиск пути с помощью алгоритма А*"""
        self.path = []
        self.childs = []
        """
        Помещаем в массив потомки старта
        Помещаем в путь старт.

        Основной цикл:
            Смотрим последний элемент массивов потомков
            Если он пуст, вынимаем этот пустой массив.
            Вынимаем последний элемент из пути.
                Проверяем, пуст ли массив потомков?
                    Если да, то возвращаем None(нет решения)
                Сбрасываем цикл на начало.
            Вынимаем первого потомка из последнего элементе массивов потомков.
            Помещаем его в путь.

            Проверяем, последний пункт пути совпадает с финишем?
                Если да - выходим из функции.(нашли)
            
            Если нет, смотрим есть ли у него потомки?
                Если есть, пихаем в массивы потомков его потомков.
                Если нет, пихаем пустой массив
        """

        left = 3
        self.childs.append(self.makeChilds(self.start, left))
        self.path.append(self.start)
        while True:
            pygame.display.update()
            if self.childs[-1] == []:
                self.childs.pop()
                self.path.pop()
                if self.childs == []:
                    # Пути нет
                    return None
                continue
            lastCell = self.childs[-1].pop(0)  # Последний элемент пути
            self.path.append(lastCell)
            if lastCell[0] == self.finish[0] and lastCell[1] == self.finish[1]:
                # Путь найден!
                self.path.pop(0)
                return self.path
            childsLastCell = self.makeChilds(lastCell, left)
            self.childs.append(childsLastCell)

    def cost(self, cell):
        """дистанция до цели"""
        return sqrt((self.finish[0] - cell[0])**2 + (self.finish[1] - cell[1])**2)
        return abs(self.finish[0] - cell[0]) + abs(self.finish[1] - cell[1])

    def makeChilds(self, cell, left=4):
        """
        создает масив ячеек из left элементов, 
        находящихся по соседству с данной, 
        отсортированных по стоимости
        """
        thisI = cell[0]
        thisJ = cell[1]
        childs = []
        costs = []
        # если клетка не занята и её нет в пути, добавляем в потомки
        for i in [-1, 0, 1]:
            newI = thisI + i
            for j in [-1, 0, 1]:
                newJ = thisJ + j
                if abs(i) == abs(j):
                    continue
                if not ((0 <= newI < self.height) and (0 <= newJ < self.width)):
                    continue
                take = self.fieldArr[newI][newJ][2]
                for step in self.path:
                    take = take and ((newI != step[0]) or (newJ != step[1]))
                if take:
                    childs.append((newI, newJ))
                    costs.append(self.cost((newI, newJ)))

        # сортируем по цене
        pairs = zip(costs, childs)
        pairs = sorted(pairs)
        toReturn = [x[1] for x in pairs]
        return toReturn[:left]


class Gui(object):
    """Графический интерфейс для задачи"""

    def __init__(self):
        global HERO
        """запускает игровой цикл"""
        pygame.init()
        #self.fpsClock = pygame.time.Clock()
        self.displaySurf = pygame.display.set_mode((WINDOWWIDTH, WINDOWHEIGHT))
        pygame.display.set_caption('Поиск пути в лабиринте')
        self.font = pygame.font.Font('freesansbold.ttf', BASEFONTSIZE)
        self.alertFont = pygame.font.Font('freesansbold.ttf', ALERTFONTSIZE)
        self.minifont = pygame.font.Font('freesansbold.ttf', 12)
        self.running = True
        # состояния
        self.state = SETSTATE
        self.lastCell = (None, None)
        self.dragging = False

        self.workArray = [[True] * WIDTH for _ in range(HEIGHT)]
        self.workArray[START[0]][START[1]] = True
        self.workArray[FINISH[0]][FINISH[1]] = True
        # игровой цикл
        try:
            self.mainloop()
        finally:
            pygame.quit()
            # sys.exit()

    def mainloop(self):
        global HERO
        while self.running:
            iSleep = False
            # делаем начальные вещи
            self.displaySurf.fill(BGCOLOR)
            # рисуем доску
            for i in range(HEIGHT):
                for j in range(WIDTH):
                    x = XMARGIN + j * FULLSELLSIZE
                    y = YMARGIN + i * FULLSELLSIZE
                    if self.workArray[i][j]:
                        color = FREECELLCOLOR
                    else:
                        color = LOCKCELLCOLOR
                    pygame.draw.rect(self.displaySurf, color,
                                     (x, y, SIZE_OF_CELL, SIZE_OF_CELL))
            # self.drawCoords() раскоментировать, если нужно увидеть координаты клеток
            # self.drawMarks() раскомментировать, если нужно увидеть цифровые метки
            # нанесенные во время работы волнового алгоритма
            # рисуем колобка
            radius = int((SIZE_OF_CELL - MARGIN) / 2)
            x = int(XMARGIN + HERO[0] * FULLSELLSIZE) + \
                radius + int(MARGIN / 2)
            y = int(YMARGIN + HERO[1] * FULLSELLSIZE) + \
                radius + int(MARGIN / 2)
            pygame.draw.circle(self.displaySurf, BALLCOLOR, (x, y), radius)

            # рисуем цель
            radius = int((SIZE_OF_CELL) / 2)
            x = int(XMARGIN + FINISH[0] * FULLSELLSIZE) + radius
            y = int(YMARGIN + FINISH[1] * FULLSELLSIZE) + radius
            pygame.draw.circle(
                self.displaySurf, TARGETCOLOR, (x, y), radius, MARGIN)
            # рисуем текст
            self.drawNotes()
            if self.state == SETSTATE:
                # обрабатываем события
                for event in pygame.event.get():
                    if event.type == QUIT:
                        self.running = False

                    elif event.type == MOUSEBUTTONUP:
                        self.dragging = False
                        self.lastCell = (None, None)

                    elif event.type == MOUSEBUTTONDOWN:
                        self.dragging = True

                    elif event.type == KEYUP:
                        if event.key == K_ESCAPE:
                            self.running = False
                        elif event.key == K_RETURN:
                            # находим путь и переходим в режим прогулки
                            task = Task('', self.workArray, START, FINISH)
                            self.path = task.solveByWaveAlgorithm()
                            if self.path == None:
                                alertSurf = self.alertFont.render(
                                    'НЕТ ПУТИ!', True, TARGETCOLOR)
                                alertRect = alertSurf.get_rect()
                                alertRect.topleft = (int((WINDOWWIDTH - alertRect.width) / 2),
                                                     int((WINDOWHEIGHT - alertRect.height) / 2))
                                self.displaySurf.blit(alertSurf, alertRect)
                                iSleep = True
                            else:
                                self.path.extend([FINISH] * 5)
                                self.state = WALKSTATE

                # делаем стенку
                pos = pygame.mouse.get_pos()
                if self.dragging:
                    curCell = self.defCell(pos)
                    change = self.lastCell != curCell
                    self.lastCell = curCell
                    if change:
                        i, j = curCell
                        if i != None:
                            self.workArray[i][j] = not self.workArray[i][j]

            if self.state == WALKSTATE:
                # двигаемся по маршруту
                delay = 100
                pygame.time.delay(delay)
                cur = self.path.pop(0)
                HERO = (cur[0], cur[1])
                if self.path == []:
                    self.state = SETSTATE
                    HERO = START
            # в самом конце обновляем экран
            # self.fpsClock.tick(30)
            pygame.display.update()
            if iSleep:
                sleep(2)
                iSleep = False

    def drawMarks(self):
        """Рисует числовые метки на квадратах, если использовался волновой метод"""
        for markNum in range(len(NUMARRAY)):
            for cell in NUMARRAY[markNum]:
                if cell:
                    i, j = cell
                    x = XMARGIN + i * FULLSELLSIZE + SIZE_OF_CELL / 2
                    y = YMARGIN + j * FULLSELLSIZE + SIZE_OF_CELL / 2
                    textSurf = self.minifont.render(str(markNum),
                                                    True, (255, 0, 0))
                    textRect = textSurf.get_rect()
                    textRect.topleft = (x, y)
                    self.displaySurf.blit(textSurf, textRect)

    def defCell(self, pos):
        """функция принимает позицию курсора, возвращает координаты ячейки"""
        x = pos[0] - XMARGIN
        y = pos[1] - YMARGIN

        xsize = WIDTH * FULLSELLSIZE
        ysize = HEIGHT * FULLSELLSIZE

        if x < 0 or x >= xsize or y < 0 or y >= ysize:
            return NOCELL

        if x % FULLSELLSIZE > SIZE_OF_CELL or y % FULLSELLSIZE > SIZE_OF_CELL:
            return NOCELL

        return (int(y // FULLSELLSIZE), int(x // FULLSELLSIZE))

    def drawCoords(self):
        """рисует координаты клеток"""
        for i in range(HEIGHT):
            for j in range(WIDTH):
                x = XMARGIN + j * FULLSELLSIZE
                y = YMARGIN + i * FULLSELLSIZE
                textSurf = self.minifont.render('(%s, %s)' % (j, i),
                                                True, (0, 0, 0))
                textRect = textSurf.get_rect()
                textRect.topleft = (x, y)
                self.displaySurf.blit(textSurf, textRect)

    def drawNotes(self):
        """рисует инструкции на поле"""
        textSurf = self.font.render('Левая кнопка мыши - заблокировать/освободить ячейку',
                                    True, FREECELLCOLOR)
        textRect = textSurf.get_rect()
        textRect.topleft = (XMARGIN, MARGIN)
        self.displaySurf.blit(textSurf, textRect)

        textSurf = self.font.render('Enter - найти путь до цели',
                                    True, FREECELLCOLOR)
        textRect = textSurf.get_rect()
        textRect.topleft = (XMARGIN, MARGIN * 2 + BASEFONTSIZE)
        self.displaySurf.blit(textSurf, textRect)

if __name__ == '__main__':
    Gui()
