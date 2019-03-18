getWidth = function (div) {
    return div.offsetWidth;
};

getHeight = function (div) {
    return div.offsetHeight;
};

getId = function (id) { // писать в кавычках!
   return document.getElementById(id);
};

getClassName = function (someClass) { // писать в кавычках!
    return document.getElementsByClassName(someClass);
};

enableDisableClass = function (id, someClass) {// писать в кавычках!
    var classList = id.className.split(/\s+/), isEnable = false, newList = '';
    for (var i = 0; i < classList.length; i++) {
        if (classList[i] == someClass) {
            isEnable = true;
            classList.splice(i,1);
        }
    }
    isEnable ? newList = classList.join(' ') : newList = classList.join(' ') + ' ' + someClass;
    id.setAttribute('class', newList);
};

disable = function (id) {
    classList = getId(id).className;
    getId(id).setAttribute('class', classList + ' d-none');
};

enable = function (id) {
    var classList = getId(id).className.split(/\s+/), newList = '';
    for (var i = 0; i < classList.length; i++) {

        if (classList[i] == 'd-none') {
            continue;
        }
        newList += classList[i] + ' ';
    }
    getId(id).setAttribute('class', newList);
};

changeDiv = function (id1, id2) {
    disable(id1);
    enable(id2);
};

writingText = function (place, text) {
    (function() {
        var i = -1;
        return function() {
            if ( ++i < text.length ) {
                place.innerHTML += text[i];
                typetext = setTimeout( arguments.callee, 100 );
            }
        }();
    })();
};

closePopup = function(id) {
    getId(id).addEventListener('click', function(e) {
        if (e.target !== getId(id)) {
            return;
        }
        disable(id);
    })
};

String.prototype.isEmpty = function() {
    return (this.length === 0 || !this.trim());
};

/* ЗАПУСК ИГРЫ */
startGame = function() {
    DisplayGame.addButtonsEvents(); //начинаем "прослушивать" кнопки
    myPet.startTimers(); //запускаем обратный отсчёт для счётчиков состояний
};

/*ОСТАНОВКА ИГРЫ*/
gameOver = function () {
    enable('game_over');
};
