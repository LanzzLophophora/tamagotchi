DisplayGame = {
    selector: getId('game_zone'),

    informer: {
        selector: document.getElementById('info'),
        setText: function (text) {
            this.selector.innerText = text;
        },
    },

    buttons: document.getElementsByClassName('pet-action'),

    addButtonsEvents: function () {
        for (i = 0; i < this.buttons.length; i += 1) {
            this.buttons[i].addEventListener('click', function () {
                action = this.getAttribute('id');
                myPet[action]();
            });
        };
    },
};

var petList = {
    cat: Cat,
    dragon: Dragon,
    poo: Poo,
};

var petHome = getId('pet');
var petName = getId('name');
var typetext = null;
var myAnimal;
var myPet;

power.onclick = function () {
    changeDiv('power', 'loader');
    enableDisableClass(getId('display_off'), 'display-on');

    setTimeout(function () {
        changeDiv('loader', 'check_animal');
    }, 3000);

    setTimeout(function () {
        writingText(getId('type_text'), 'Welcome to the game! Choose your animal!');
    }, 4000);
};

choose.onclick = function () {
    radios = document.getElementsByName('my-choice');
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].type === 'radio' && radios[i].checked) {
            myAnimal = radios[i].getAttribute('id');
        };
    };

    if (i == radios.length && myAnimal == undefined) {
        enable('popup');
        closePopup('popup');
        return;
    };

    if (myAnimal !== undefined) {
        changeDiv('choice', 'name');
        changeDiv('choose', 'name_ok');
        enableDisableClass(petHome, myAnimal);

        clearTimeout(typetext);
        getId('type_text').innerHTML = '';
        writingText(getId('type_text'), 'Great choice! What is your pet\'s name?');
    };
};

petName.onkeydown = function (e) {
    if ((e.keyCode > 47 && e.keyCode < 57) || (e.keyCode > 95 && e.keyCode < 112) || (e.keyCode > 186 && e.keyCode < 193)) {
        return false;
    }
    if (e.key == 'Enter') {
        name_ok();
    }
};

name_ok.onclick = function () {
    getId('type_text_confirm').innerHTML = 'Pet by name <i><b>' + petName.value + '</b></i>? Are you sure?';
    enable('confirm');

    start.onclick = function () {
        disable('confirm');
        if (petName.value.isEmpty()) {
            if (myAnimal == 'poo') {
                getId('unnamed_text').innerHTML = 'Well, then he will be called Poo!';
                enable('unnamed');
                closePopup('unnamed');
                petName.value = 'Poo';
            } else {
                getId('unnamed_text').innerHTML = 'Well, then he will be called Lady Gaga!';
                enable('unnamed');
                closePopup('unnamed');
            }
        } else {
            getId('named_text').innerHTML = 'Hmm... Nice. As you wish... =/';
            enable('named');
            closePopup('named');
        };

        changeDiv('check_animal', 'game_display');
        enable('btn_group');

        myPet = new petList[myAnimal](petName.value);

        enableDisableClass(getId('display_off'), 'display-play');

        startGame();
        myPet.setPosition();
    };

    cancel.onclick = function () {
        clearTimeout(typetext);
        getId('type_text').innerHTML = 'What is your pet\'s name?';
        disable('confirm');
    };
};

reload.onclick = function () {
    window.location.reload();
};
