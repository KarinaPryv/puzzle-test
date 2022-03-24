// Позиціонування зображення на пазлах

let bgPositionArr = ['0px 0px', '300px 0px', '200px 0px', '100px 0px', '0px 300px', '300px 300px', '200px 300px', '100px 300px', '0px 200px', '300px 200px', '200px 200px', '100px 200px', '0px 100px', '300px 100px', '200px 100px', '100px 100px'];
let topPositionArr = ['0px', '0px', '0px', '0px', '100px', '100px', '100px', '100px', '200px', '200px', '200px', '200px', '300px', '300px', '300px', '300px'];
let leftPositionArr = ['0px', '100px', '200px', '300px', '0px', '100px', '200px', '300px', '0px', '100px', '200px', '300px', '0px', '100px', '200px', '300px'];

for (let i = 0; i < bgPositionArr.length; i++) {
    document.getElementsByClassName('puzzle')[i].style.backgroundPosition = bgPositionArr[i];
}

//Функціонал перемішування пазлів

function puzzleRandomizer() {

    let randomIndexArr = [];

    while (randomIndexArr.length < 16) {
        let indexNum = Math.round(Math.random() * 15);
        if (randomIndexArr.includes(indexNum) == false) {
            randomIndexArr.push(indexNum);
        }
    }

    for (let i = 0; i < bgPositionArr.length; i++) {
        document.getElementsByClassName('puzzle')[i].style.top = topPositionArr[randomIndexArr[i]];
        document.getElementsByClassName('puzzle')[i].style.left = leftPositionArr[randomIndexArr[i]];
    }
}

puzzleRandomizer();

//Перевірка на правильність складання пазлу

let check;
let checkTop, checkLeft;

function checkPuzzlePosition() {

    check = true;

    for (let i = 0; i < document.getElementsByClassName('puzzle').length; i++) {
        checkTop = parseInt(document.getElementsByClassName('puzzle')[i].style.top);
        checkLeft = parseInt(document.getElementsByClassName('puzzle')[i].style.left) - 500;
        if (checkLeft != parseInt(leftPositionArr[i]) || checkTop != parseInt(topPositionArr[i])) {
            check = false;
            break;
        }
    }

}

$(document).ready(function () {

    //Функції модального вікна

    function slideModalDown(modalText) {
        $('.modal-background').css('display', 'block');
        $('.modal').animate({
            top: '100px'
        }, 400);
        $('.modal h3').html(modalText);
    }

    function slideModalUp() {
        $('.modal').animate({
            top: '0px'
        }, 200, function () {
            $('.modal-background').css('display', 'none');
        });
    }

    //Робота таймера

    let minutes = '00';
    let seconds = 60;
    let timerID;
    let timerText;

    function timerCycle() {

        if (seconds == 00) {
            timerReset();
            checkPuzzlePosition();
            if (check == true) {
                slideModalDown('Woohoo, well done, you did it!');
            }
            else if (check == false) {
                slideModalDown(`It's a pity, but you lost.`);
            }
            $('.check-result-btn').prop('disabled', true);
            $('.check-btn').css('display', 'none');
        }
        else {
            seconds = seconds - 1;
            if (seconds < 10) {
                seconds = '0' + seconds;
            }
            $('.timer').html(`${minutes}:${seconds}`);
            timerText = $('.timer').text();
        }

    }

    function timerReset() {

        clearInterval(timerID);
        $('.timer').html('00:00');
        seconds = 60;

    }

    //Функція запуску гри

    function startGame() {

        if (seconds == 60) {
            timerID = setInterval(timerCycle, 1000);
        }

        setTimeout(function () {
            $('.timer').css('width', '140px');
        }, 1000);

        $('.start-btn').prop('disabled', true);

    }

    //функціонал перетягування пазлів

    let leftPosition, newLeftPosition, topPosition, newTopPosition;

    $('.puzzle').draggable({
        containment: '.puzzle-container',
        zIndex: 3,
        stop: function (event, ui) {
            leftPosition = ui.position.left / 100;
            newLeftPosition = Math.round(leftPosition) * 100;
            topPosition = ui.position.top / 100;
            newTopPosition = Math.round(topPosition) * 100;
            if (newLeftPosition < 500) {
                $(this).css({
                    left: ui.originalPosition.left,
                    top: ui.originalPosition.top
                });
            }
            else {
                $(this).css({
                    left: newLeftPosition,
                    top: newTopPosition
                });
            }
        }
    });

    $('.right-block').droppable({
        over: function () {
            startGame();
            $('.check-result-btn').prop('disabled', false);
        }
    });

    //Функціонал для кнопок

    $('.start-btn').on('click', function () {
        startGame();
        $('.check-result-btn').prop('disabled', false);
    });

    $('.check-result-btn').on('click', function () {
        slideModalDown(`You still have time, you sure? ${timerText}`);
        clearInterval(timerID);
    });

    $('.check-btn').on('click', function () {
        checkPuzzlePosition();
        if (check == true) {
            slideModalDown('Woohoo, well done, you did it!');
        }
        else if (check == false) {
            slideModalDown(`It's a pity, but you lost.`);
        }
        timerReset();
        $('.check-btn').css('display', 'none');
        $('.check-result-btn').prop('disabled', true);
    });

    $('.close-btn').on('click', function () {
        slideModalUp();
        if (seconds != 60 && seconds != 00) {
            timerID = setInterval(timerCycle, 1000);
        }
    });

    $('.new-btn').on('click', function () {
        puzzleRandomizer();
        timerReset();
        $('.timer').html('01:00');
        $('.start-btn').prop('disabled', false);
        $('.check-result-btn').prop('disabled', true);
        $('.check-btn').css('display', 'block');
    });
});