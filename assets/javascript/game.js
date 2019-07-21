let combatants; // Dictionary of combatant names and fighter objects

const main = {
    initialize() {
        this.combatants = { // fill combatants with a fresh array of fighters when we initialize
            "Obi Wan": new Fighter("Obi Wan", 120, 8, 20, cut),
            "Darth Maul": new Fighter("Darth Maul", 180, 5, 25, doubleCut),
            "Luke Skywalker": new Fighter("Luke Skywalker", 100, 10, 5),
            "Darth Sidious": new Fighter("Darth Sidious", 150, 6, 15)
        };
        this.state = 'character select';

        const stage = $('#stage');
        for (const name in this.combatants) {
            stage.append(makeCard(this.combatants[name]));
        }

        $('#game').on('click', '.fighter', cardListener);

        $('#attack').on('click', attack);

        $('#message').text('Choose your fighter');
    },
    char: '',
};


function makeCard(fighter) {
    console.log(fighter);
    return $('<div>').addClass('card fighter p-1 col-6 col-md-3').attr('value', fighter.name).attr('id', fighter.name.replace(' ', '')).append(
        $('<img>').attr('src', `assets/images/${fighter.name}.png`),
        $('<div>').addClass('card-body').append(
            $('<h5>').addClass('card-title').text(fighter.name),
            $('<p>').addClass('card-text').text(fighter.HP)
        )
    );
}

function cardListener(event) {
    switch (main.state) {
        case 'character select':
            // I am completely baffled as to why event.currentTarget.value is undefined;

            main.char = $(this).attr('value');
            console.log(main.char);
            $(this).detach().removeClass('col-6 col-md-3').appendTo('#your-character');
            main.state = 'opponent select';
            $('#message').text('Choose your opponent');
            return;
        case 'opponent select':
            if ($(this).attr('value') != main.char) {
                main.enemy = $(this).attr('value');

                $(this).detach().removeClass('col-6 col-md-3').appendTo('#defender');
                $('#message').text('Fight!');
                main.state = 'combat';

                // $('#stage').detach().appendTo('#game');
            }

    }
}

function attack() {
    if (main.combatants[main.char].attackTarget(main.combatants[main.enemy])) {
        console.log(`${main.enemy} defeated`);
        $(`#${main.enemy.replace(' ', '')}`).remove();
        main.state = 'opponent select';
    } else if (main.combatants[main.char].HP <= 0) {
        console.log('You lose');
    }
    $(`#${main.char.replace(' ', '')}>.card-body>.card-text`).text(main.combatants[main.char].HP);
    $(`#${main.enemy.replace(' ', '')}>.card-body>.card-text`).text(main.combatants[main.enemy].HP);
}

function updateDisplay() {
    if (displayBuffer[0]) {
        console.log(displayBuffer[0]);
        const next = displayBuffer.shift();
        $('.battle-menu').hide();
        $('.battle-display').css(
            'cursor', 'pointer').text(
            next.text); // Buffer should be no more than a few lines
        if (next.animation) {
            next.animation();
        }
    } else {
        $('.battle-display').css(
            'cursor', 'auto').empty();
        $('.battle-menu').show();
    }
}

function updateHpBar(who, pctHP) { //who is 'player' or 'enemy'
    console.log('HP Bar Animation');

    const hpBar = $(`.stats.${who} .hp-bar-inner`)

    if (pctHP >= .50) {
        hpBar.css('background', 'green');
    } else if (pctHP >= .25) {
        hpBar.css('background', 'gold');
    } else {
        hpBar.css('background', 'firebrick');
    }
    hpBar.animate({
        'width': pctHP * 85 + "%"
    }, 700);
}

function defeatAnimation(who) {
    console.log(`.sprite.${who} img`);
    const sprite = $(`.sprite.${who} img`);
    sprite.animate({
        'top': '100%',
        'height': '50%',
        'easing': jQuery.easing.easeInQuint // from easing library
    }, 700, function() {
        sprite.remove();
    });
}

// Cutting animation, takes 'player' or 'enemy' as argument
function cut(who, blinks) {
    const cut = $('<div class="cut">').append(
        $('<div class="path">').append(
            $('<div class="star8">'),
            $('<div class="line">')
        )).appendTo($(`.sprite.${who}`));
    $('.cut .path>.star8').animate({
        bottom: '-17px',
        left: '-17px',
        easing: 'linear'
    }, 400);
    $('.cut .path>.line').animate({
        width: '100%',
        easing: 'linear'
    }, 400, function() {
        blink(who, blinks);
        cut.remove();
    });
}

function doubleCut(who) {
    const animation = $('<div class="cut-back">').append(
        $('<div class="path">').append(
            $('<div class="star8">'),
            $('<div class="line">')
        )).appendTo($(`.sprite.${who}`));

    $('.cut-back .path>.star8').animate({
        right: '-17px',
        easing: 'linear'
    }, 400);

    $('.cut-back .path>.line').animate({
        width: '100%',
        easing: 'linear',
    }, 400, function() {
        animation.remove();
        cut(who, 2);
    });
}

// function blink(who) {
//     console.log(`blink ${who}`);
//     const sprite = $(`.sprite.${who} img`);
//     sprite.fadeOut(200);
//     sprite.fadeIn(200);
// }

function blink(who, times) {
    const sprite = $(`.sprite.${who} img`);
    times = times ? times : 1;
    while (times--) {
        sprite.fadeOut(200);
        sprite.fadeIn(200);
    }
}

// $.bez([0.86, 0.01, 0.72, 0.03])
const displayBuffer = [];

$(document).ready(function() {
    main.initialize();

    main.char = main.combatants["Obi Wan"];
    main.enemy = main.combatants["Darth Maul"];



    // Battle events

    //TODO add display buffer to queue messages, only display battle menu when all text is displayed
    $('.battle-display').on('click', function() {
        updateDisplay();
    })

    // Combat logic happens here.
    $('.battle-menu #fight').on('click', function() {
        const res = main.char.attackTarget(main.enemy);
        displayBuffer.push({
            text: `${main.char.name} attacks ${main.enemy.name} for ${main.char.attack * (main.char.level - 1)} damage.`,
            // How would I bundle the values for main.enemy.HP with the function rather than references to them?
            // Function.prototype.apply doesn't seem to do what I would expect.
            animation: () => {
                updateHpBar('enemy', main.enemy.HP / main.enemy.maxHP);
                main.char.attackAnimation('enemy');
            }
        });
        if (res) {
            displayBuffer.push({
                text: `${main.enemy.name} counterattacks for ${res} damage.`,
                animation: () => {
                    updateHpBar('player', main.char.HP / main.char.maxHP);
                    main.enemy.attackAnimation('player');
                    $('.stats.player .hp-value').text(`${main.char.HP > 0 ? main.char.HP : 0} / ${main.char.maxHP}`);
                }
            });
            if (main.char.HP <= 0) {
                displayBuffer.push({
                    text: `${main.char.name} is defeated.`,
                    animation: () => {
                        defeatAnimation('player');
                    }
                });
                //TODO put logic for when player loses here
            }
        } else {
            displayBuffer.push({ text: `${main.enemy.name} is defeated.` });
        }

        updateDisplay(); // 

        $('.stats.player .level').text(`Lv${main.char.level}`);
    });

    // Logic for the buttons that don't do anything
    $('.battle-menu #jedi').on('click', function() {
        displayBuffer.push({ text: 'You have no other Jedi!' });
        updateDisplay();
    });

    $('.battle-menu #item').on('click', function() {
        displayBuffer.push({ text: 'Yoda: This isn\'t the time to use that!' });
        updateDisplay();
    });

    $('.battle-menu #run').on('click', function() {
        displayBuffer.push({ text: 'You can\'t run from a Jedi battle!' });
        updateDisplay();
    });

    $('.cut').on('mouseover', function() {
        $('.cut .star8').animate({
            bottom: '-17',
            left: '-17',
            easing: 'linear'
        }, 400);
        $('.cut .path>.line').animate({
            width: '100%',
            easing: 'linear'
        }, 400);
    })



});