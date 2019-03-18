//конструктор питомцев
function Pet(name) {

    /*ХАРАКТЕРИСТИКИ ПЭТА*/

    this.selector = getId('pet');
    this.width = getWidth(this.selector);
    this.height = getHeight(this.selector);

    this.name = name || 'Lady Gaga';
    this.state = null;

    this.stateToNull = function () {
        if (this.state !== null) {
            enableDisableClass(this.selector, this.state+'ing');
            clearInterval(this.funcInterval);
            clearInterval(this.clearText);
            this.state = null;
        };
    };

    this.funcInterval = null;
    this.clearText = null;

    this.healthInterval = 5;
    this.defaultValue = 100;
    this.age = 0;
    this.score = 0;

    this.health = {
        value: this.defaultValue,
        interval: null,
        isOrange: false,
        isRed: false,
        alarm: false,
        selector: getId('health'),
    };

    this.energy = {
        value: this.defaultValue,
        interval: null,
        isOrange: false,
        isRed: false,
        alarm: false,
        selector: getId('energy'),
    };

    this.satiety = {
        value: this.defaultValue,
        interval: null,
        isOrange: false,
        isRed: false,
        alarm: false,
        selector: getId('satiety'),
    };

    this.hygiene = {
        value: this.defaultValue,
        interval: null,
        isOrange: false,
        isRed: false,
        alarm: false,
        selector: getId('hygiene'),
    };

    this.mood = {
        value: this.defaultValue,
        interval: null,
        isOrange: false,
        isRed: false,
        alarm: false,
        selector: getId('mood'),
    };

    /*УМЕНИЯ ПЭТА*/

    this.doSmth = function (action, addP, removeP, x, y, startText, stopText, func, stopfunc) {
        context = this;

        this.stateToNull();
        stopfunc;

        this.state = action.id;
        this.setPosition(x, y);

        this.selector.setAttribute('class', 'animal m-0-auto ' + myAnimal);
        this.stopTimers();
        enableDisableClass(this.selector, action.id+'ing');

        startText = startText || this.name + ' is ' + action.id + 'ing...';
        stopText = stopText || this.name + ' is stop ' + action.id + 'ing!';
        DisplayGame.informer.setText(startText);

        func;

        this.funcInterval = setTimeout(function () {
            for (var key in addP) {
                context.addProgress(addP[key]);
            };
            for (var key in removeP) {
                context.removeProgress(removeP[key]);
            };

            enableDisableClass(context.selector, action.id+'ing');
            enableDisableClass(context.selector, 'stay');

            DisplayGame.informer.setText(stopText);

            context.state = null;
            context.clearText = setTimeout(function () {
                DisplayGame.informer.setText('');
            }, 1000)
            context.startTimers();
        }, 5000) // здесь настройка скиллов пэта - чем больше таймаут, тем дольше пэт будет жрать/спать/...ть
    };

    //играть
    this.play = function() {
        this.doSmth(play,[this.mood], [this.energy], null, null);
        this.score += 100;
    };
    //кушать
    this.eat = function() {
        this.doSmth(eat, [this.satiety], [], null, getHeight(DisplayGame.selector) - this.height);
        this.score += 100;
    };
    //спать
    this.sleep = function() {
        this.doSmth(sleep,[this.energy,this.energy], [this.hygiene, this.satiety, this.mood]);
        this.age ++;
        this.score += 200;
    };
    // купаться
    this.wash = function() {
        this.doSmth(wash, [this.health, this.hygiene], [this.mood]);
        this.score += 300;
    };
    // учиться
    this.learn = function() {
        this.doSmth(learn, [this.health], [this.energy, this.mood]);
        this.score += 300;
    };
    // гулять
    this.walk = function () {
        this.doSmth(walk, [this.health], [this.hygiene], null, getHeight(DisplayGame.selector) - this.height);
        this.score += 100;
    };
    // гладить
    this.caress = function () {
        var context = this;

        this.stateToNull();

        this.selector.setAttribute('class', 'animal m-0-auto ' + myAnimal);
        this.stopTimers();
        this.state = 'caress';
        DisplayGame.informer.setText('Caress me! (use scroll)');
        this.startOnwheel(event);
        enableDisableClass(context.selector, 'stay');
        this.funcInterval = setTimeout(function () {
            DisplayGame.informer.setText('It would be very nice!');
            context.startTimers();
            context.state = null;
            context.mood.selector.style.width = context.mood.value + '%';
            enableDisableClass(context.selector, 'stay');
            this.stopOnwhell(event);
            context.clearText = setTimeout(function () {
                DisplayGame.informer.setText('');
            }, 1000);
        }, 5000);
        this.score += 100;
    };

    this.startOnwheel = function (e) {
        document.onwheel = function (e) {
            context.mood.value += 0.5;
            context.mood.selector.style.width = context.mood.value + '%';
        };
    };
    this.stopOnwhell = function (e) {
        document.onwheel = function (e) {};
    };

    /*МЕТОДЫ ПЭТА*/

    // проверка статуса состояний и установка соотв.цвета
    this.checkColorStatusBar = function (param) {
        setInterval(function(){
            if (param.value > 50) {
                param.isOrange = false;
                param.isRed = false;
                param.selector.setAttribute('class', 'progress');
                return;
            }

            if (param.isOrange == false && param.value < 50) {
                param.isOrange = true;
                enableDisableClass(param.selector, 'attention');
                return;
            }

            if (param.isRed == false && param.value < 25) {
                param.isRed = true;
                enableDisableClass(param.selector, 'alarm');
                return;
            }

            if (param.isOrange == true && param.value > 50) {
                enableDisableClass(param.selector, 'attention');
                param.isOrange = false;
                return;
            }

            if (param.isRed == true && param.value > 25) {
                enableDisableClass(param.selector, 'alarm');
                param.isRed = false;
                return;
            }
        } ,10)
    };

    // метод запуска изменения состояния характеристик
    this.runProgressBar = function (param, seconds) {
        var context = this;
        var mSeconds = seconds * 1000;
        param.selector.style.width = param.value + '%';
        this.checkColorStatusBar(param);
        param.interval = setInterval(function () {
            param.value = param.value < 0 ? 0 : param.value;
            if (param.value != 0) {
                param.value = param.value > 100 ? 100 : param.value;
                param.value -= 1;
                param.selector.style.width = param.value + '%';

                if (param.alarm == true) {
                    param.alarm = false;
                    context.healthInterval += 1;
                    clearInterval(context.health.interval);
                    context.runProgressBar(context.health, context.healthInterval);
                }
            } else {
                if (param == context.health) {
                    context.stopTimers();
                    gameOver();
                } else {
                    if (param.alarm == false) {
                        param.alarm = true;
                        context.healthInterval -= 1;
                        // console.log('alarma!');
                        // console.log(context.healthInterval);
                        clearInterval(context.health.interval);
                        context.runProgressBar(context.health, context.healthInterval);
                    }
                }
            }
        }, mSeconds )
    };

    // запуск всех таймеров состояний !ЗДЕСЬ ПО СУТИ НАСТРОЙКИ СКОРОСТИ ИГРЫ! - чем меньше интервалы, тем быстрее дохнет пэт.
    this.startTimers = function() {
        this.runProgressBar(this.energy, 2);
        this.runProgressBar(this.mood, 2);
        this.runProgressBar(this.hygiene, 4);
        this.runProgressBar(this.satiety, 3);
        this.runProgressBar(this.health, this.healthInterval);
    };

    // остановка всех таймеров
    this.stopTimers = function () {
        clearInterval(this.energy.interval);
        clearInterval(this.mood.interval);
        clearInterval(this.hygiene.interval);
        clearInterval(this.satiety.interval);
        clearInterval(this.health.interval);
    };

    // пополнение счётчика
    this.addProgress = function (param) {
        param.value += 10;
        if (param.value >= 100) {
            param.value = 100;
        }
        param.selector.style.width = param.value + '%';
    };

    // уменьшение счётчика
    this.removeProgress = function (param) {
        param.value -= 5;
        param.selector.style.width = param.value + '%';
    };

    this.getXcenter = function () {
        return (getWidth(DisplayGame.selector) / 2) - (this.width / 2);
    };

    this.getYcenter = function () {
        return (getHeight(DisplayGame.selector) / 2) - (this.height / 2);
    };

    //метод задания позиции питомца в игровой зоне
    this.setPosition = function(x,y) {
        var rightEnd = getWidth(DisplayGame.selector) - this.width; //правая граница
        var bottomEnd = getHeight(DisplayGame.selector) - this.height; // нижняя граница (левая и верхняя ограничены 0).

        x = x < 0 ? 0 : x > rightEnd ? rightEnd : x || this.getXcenter();
        y = y < 0 ? 0 : y > bottomEnd ? bottomEnd : y || this.getYcenter();

        this.selector.style.top = y + 'px';
        this.selector.style.left = x + 'px';
    };
}

/*class Pet {

    /!*ХАРАКТЕРИСТИКИ ПЭТА*!/
    constructor(name) {
        this.selector = getId('pet');
        this.width = getWidth(this.selector);
        this.height = getHeight(this.selector);

        this.name = name || 'Lady Gaga';
        this.state = null;

        this.funcInterval = null;
        this.clearText = null;

        this.healthInterval = 5;
        this.defaultValue = 100;
        this.age = 0;
        this.score = 0;
    };


    stateToNull() {
        if (this.state !== null) {
            enableDisableClass(this.selector, this.state+'ing');
            clearInterval(this.funcInterval);
            clearInterval(this.clearText);
            this.state = null;
        };
    };


    indicators = {
        health: {
            value: this.defaultValue,
            interval: null,
            isOrange: false,
            isRed: false,
            alarm: false,
            selector: getId('health'),
        },

        energy: {
            value: this.defaultValue,
            interval: null,
            isOrange: false,
            isRed: false,
            alarm: false,
            selector: getId('energy'),
        },

        satiety: {
            value: this.defaultValue,
            interval: null,
            isOrange: false,
            isRed: false,
            alarm: false,
            selector: getId('satiety'),
        },

        hygiene: {
            value: this.defaultValue,
            interval: null,
            isOrange: false,
            isRed: false,
            alarm: false,
            selector: getId('hygiene'),
        },

        mood: {
            value: this.defaultValue,
            interval: null,
            isOrange: false,
            isRed: false,
            alarm: false,
            selector: getId('mood'),
        },
    };



    /!*УМЕНИЯ ПЭТА*!/

    doSmth (action, addP, removeP, x, y, startText, stopText, func, stopfunc) {
        var context = this;

        this.stateToNull();
        stopfunc;

        this.state = action.id;
        this.setPosition(x, y);

        this.selector.setAttribute('class', 'animal m-0-auto ' + myAnimal);
        this.stopTimers();
        enableDisableClass(this.selector, action.id+'ing');

        startText = startText || this.name + ' is ' + action.id + 'ing...';
        stopText = stopText || this.name + ' is stop ' + action.id + 'ing!';
        DisplayGame.informer.setText(startText);

        func;

        this.funcInterval = setTimeout(function () {
            for (var key in addP) {
                context.addProgress(addP[key]);
            };
            for (var key in removeP) {
                context.removeProgress(removeP[key]);
            };

            enableDisableClass(context.selector, action.id+'ing');
            enableDisableClass(context.selector, 'stay');

            DisplayGame.informer.setText(stopText);

            context.state = null;
            context.clearText = setTimeout(function () {
                DisplayGame.informer.setText('');
            }, 1000)
            context.startTimers();
        }, 5000) // здесь настройка скиллов пэта - чем больше таймаут, тем дольше пэт будет жрать/спать/...ть
    };

    //играть
    play () {
        this.doSmth(play,[this.indicators.mood], [this.indicators.energy], null, null);
        this.score += 100;
    };
    //кушать
    eat () {
        this.doSmth(eat, [this.indicators.satiety], [], null, getHeight(DisplayGame.selector) - this.height);
        this.score += 100;
    };
    //спать
    sleep () {
        this.doSmth(sleep,[this.indicators.energy, this.indicators.energy], [this.indicators.hygiene, this.indicators.satiety, this.indicators.mood]);
        this.age ++;
        this.score += 200;
    };
    // купаться
    wash () {
        this.doSmth(wash, [this.indicators.health, this.indicators.hygiene], [this.indicators.mood]);
        this.score += 300;
    };
    // учиться
    learn () {
        this.doSmth(learn, [this.indicators.health], [this.indicators.energy, this.indicators.mood]);
        this.score += 300;
    };
    // гулять
    walk () {
        this.doSmth(walk, [this.indicators.health], [this.indicators.hygiene], null, getHeight(DisplayGame.selector) - this.height);
        this.score += 100;
    };
    // гладить
    caress () {
        var context = this;

        this.stateToNull();

        this.selector.setAttribute('class', 'animal m-0-auto ' + myAnimal);
        this.stopTimers();
        this.state = 'caress';
        DisplayGame.informer.setText('Caress me! (use scroll)');
        this.startOnwheel(event);
        enableDisableClass(context.selector, 'stay');
        this.funcInterval = setTimeout(function () {
            DisplayGame.informer.setText('It would be very nice!');
            context.startTimers();
            context.state = null;
            context.mood.selector.style.width = context.mood.value + '%';
            enableDisableClass(context.selector, 'stay');
            this.stopOnwhell(event);
            context.clearText = setTimeout(function () {
                DisplayGame.informer.setText('');
            }, 1000);
        }, 5000);
        this.score += 100;
    };

    startOnwheel (e) {
        document.onwheel = function (e) {
            context.mood.value += 0.5;
            context.mood.selector.style.width = context.mood.value + '%';
        };
    };

    stopOnwhell (e) {
        document.onwheel = function (e) {};
    };

    /!*МЕТОДЫ ПЭТА*!/

    // проверка статуса состояний и установка соотв.цвета
    checkColorStatusBar (param) {
        setInterval(function(){
            if (param.value > 50) {
                param.isOrange = false;
                param.isRed = false;
                param.selector.setAttribute('class', 'progress');
                return;
            }

            if (param.isOrange == false && param.value < 50) {
                param.isOrange = true;
                enableDisableClass(param.selector, 'attention');
                return;
            }

            if (param.isRed == false && param.value < 25) {
                param.isRed = true;
                enableDisableClass(param.selector, 'alarm');
                return;
            }

            if (param.isOrange == true && param.value > 50) {
                enableDisableClass(param.selector, 'attention');
                param.isOrange = false;
                return;
            }

            if (param.isRed == true && param.value > 25) {
                enableDisableClass(param.selector, 'alarm');
                param.isRed = false;
                return;
            }
        } ,10)
    };

    // метод запуска изменения состояния характеристик
    runProgressBar (param, seconds) {
        var context = this;
        var mSeconds = seconds * 1000;
        param.selector.style.width = param.value + '%';
        this.checkColorStatusBar(param);
        param.interval = setInterval(function () {
            param.value = param.value < 0 ? 0 : param.value;
            if (param.value != 0) {
                if (param.value >= 100) {
                    param.value = 100;
                };
                param.value -= 1;
                param.selector.style.width = param.value + '%';

                if (param.alarm == true) {
                    param.alarm = false;
                    context.healthInterval += 1;
                    clearInterval(context.indicators.health.interval);
                    context.runProgressBar(context.indicators.health, context.healthInterval);
                }
            } else {
                if (param == context.indicators.health) {
                    context.stopTimers();
                    gameOver();
                } else {
                    if (param.alarm == false) {
                        param.alarm = true;
                        context.healthInterval -= 1;
                        console.log('alarma!');
                        console.log(context.healthInterval);
                        clearInterval(context.indicators.health.interval);
                        context.runProgressBar(context.indicators.health, context.healthInterval);
                    }
                }
            }
        }, mSeconds )
    };

    // запуск всех таймеров состояний !ЗДЕСЬ ПО СУТИ НАСТРОЙКИ СКОРОСТИ ИГРЫ! - чем меньше интервалы, тем быстрее дохнет пэт.
   startTimers () {
        this.runProgressBar(this.indicators.energy, 2);
        this.runProgressBar(this.indicators.mood, 2);
        this.runProgressBar(this.indicators.hygiene, 4);
        this.runProgressBar(this.indicators.satiety, 3);
        this.runProgressBar(this.indicators.health, this.healthInterval);
    };

    // остановка всех таймеров
    stopTimers () {
        clearInterval(this.indicators.energy.interval);
        clearInterval(this.indicators.mood.interval);
        clearInterval(this.indicators.hygiene.interval);
        clearInterval(this.indicators.satiety.interval);
        clearInterval(this.indicators.health.interval);
    };

    // пополнение счётчика
    addProgress (param) {
        param.value += 10;
        if (param.value >= 100) {
            param.value = 100;
        }
        param.selector.style.width = param.value + '%';
    };

    // уменьшение счётчика
    removeProgress(param) {
        param.value -= 5;
        param.selector.style.width = param.value + '%';
    };

   getXcenter () {
        return (getWidth(DisplayGame.selector) / 2) - (this.width / 2);
    };

   getYcenter () {
        return (getHeight(DisplayGame.selector) / 2) - (this.height / 2);
    };

    //метод задания позиции питомца в игровой зоне
    setPosition (x,y) {
        var rightEnd = getWidth(DisplayGame.selector) - this.width; //правая граница
        var bottomEnd = getHeight(DisplayGame.selector) - this.height; // нижняя граница (левая и верхняя ограничены 0).

        x = x < 0 ? 0 : x > rightEnd ? rightEnd : x || this.getXcenter();
        y = y < 0 ? 0 : y > bottomEnd ? bottomEnd : y || this.getYcenter();

        this.selector.style.top = y + 'px';
        this.selector.style.left = x + 'px';
    };
}*/

function Cat() {
    Pet.call(this);

    this.energy.value = this.defaultValue / 2;

    this.wash = function() {
        this.doSmth(wash, [this.health, this.hygiene], [this.mood, this.mood, this.mood], null, null, 'Brrr!! I hate it!', 'It was terrible!');
        this.score -= 100;
    };

    this.sleep = function() {
        this.doSmth(sleep,[this.energy,this.energy,this.energy,this.energy, this.mood], [this.hygiene, this.satiety]);
        this.age ++;
        this.score += 100;
    };
}

function Dragon() {
    Pet.call(this);

    this.healthInterval = 10;

    this.mood.value = this.defaultValue / 2;
    this.satiety.value = this.defaultValue / 2;

    this.startTimers = function() {
        this.runProgressBar(this.energy, 5);
        this.runProgressBar(this.mood, 5);
        this.runProgressBar(this.hygiene, 2);
        this.runProgressBar(this.satiety, 1);
        this.runProgressBar(this.health, this.healthInterval);
    };

    this.eat = function() {
        this.doSmth(eat, [this.satiety, this.mood, this.mood], [], null, getHeight(DisplayGame.selector) - this.height);
        this.score += 100;
    };

    this.wash = function() {
        this.doSmth(wash, [], [this.mood, this.mood, this.health], null, null, 'My ... flame ... dying away ...', 'Seriously, I could die like that!');
        this.score -= 100;
    };

    this.sleep = function() {
        this.doSmth(sleep,[this.energy,this.energy, this.hygiene, this.mood], [this.satiety, this.satiety], null, null, null, '100 years have passed.' );
        this.age ++;
        this.score += 100;
    };

    this.caress = function () {
        var context = this;
        this.stateToNull();
        this.selector.setAttribute('class', 'animal m-0-auto ' + myAnimal);
        this.stopTimers();
        this.state = 'caress';
        DisplayGame.informer.setText('Dont touch me! (don\'t even think about touching the scroll)');
        document.onwheel = function (e) {
            context.mood.value -= 1;
            context.mood.selector.style.width = context.mood.value + '%';
        };
        enableDisableClass(context.selector, 'stay');
        this.funcInterval = setTimeout(function () {
            DisplayGame.informer.setText('I hate it!');
            context.startTimers();
            context.state = null;
            enableDisableClass(context.selector, 'stay');
            context.mood.selector.style.width = context.mood.value + '%';
            document.onwheel = function (e) {};
            context.clearText = setTimeout(function () {
                DisplayGame.informer.setText('');
            }, 1000);
        }, 5000);
        this.score -= 200;
    };
}

function Poo() {
    Pet.call(this);

    this.healthInterval = 3;

    this.startTimers = function() {
        this.runProgressBar(this.energy, 0.5);
        this.runProgressBar(this.mood, 0.5);
        this.runProgressBar(this.hygiene, 0.7);
        this.runProgressBar(this.satiety, 0.7);
        this.runProgressBar(this.health, this.healthInterval);
    };

    this.hygiene.value = (this.defaultValue / 2);

}
