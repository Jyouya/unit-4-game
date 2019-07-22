let combatants; // Dictionary of combatant names and fighter objects

const main = {
    initialize() {
        this.combatants = { // fill combatants with a fresh array of fighters when we initialize
            "Obi Wan": new Fighter("Obi Wan", 120, 8, 20, thunder),
            "Darth Maul": new Fighter("Darth Maul", 180, 5, 25, doubleCut),
            "Luke Skywalker": new Fighter("Luke Skywalker", 100, 10, 5, cut),
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

    const hpBar = $(`.stats.${who} .hp-bar-inner`)

    hpBar.animate({
        'width': pctHP * 85 + "%"
    }, {
        step: (number, tween) => {
            if (number >= 85 * .5) {
                hpBar.css('background', 'green');
            } else if (number >= 85 * .25) {
                hpBar.css('background', 'gold');
            } else {
                hpBar.css('background', 'firebrick');
            }
        },
        duration: 700
    });
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

function blink(who, times) {
    const sprite = $(`.sprite.${who} img`);
    times = times ? times : 1;
    while (times--) {
        sprite.fadeOut(200);
        sprite.fadeIn(200);
    }
}

// coordinates for thunder animation;
const thunderbolt = [
    [8, 1],
    [6, 3],
    [6, 5],
    [8, 6],
    [8, 8],
    [7, 9],
    [12, 12],
    [10, 13],
    [5, 12],
    [9, 16],
    [11, 17],
    [10, 18],
    [9, 18],
    [6, 21],
    [9, 23],
    [5, 26],
    [7, 27],
    [3, 31],
    [1, 32],
    [3, 33],
    [11, 35],
    [7, 39],
    [10, 40],
    [19, 43],
    [17, 45],
    [15, 47],
    [18, 48],
    [15, 50],
    [14, 52],
    [16, 54],
    [16, 55],
];

function thunder(who) {
    // const path = $('<div class="thunder-container">');
    const jc = $('<canvas id="thunder">')
        .attr('width', '250px')
        .attr('height', '250px')
        .appendTo(`.sprite.${who}`)
    const c = jc[0].getContext('2d');

    const img = $(`.sprite.${who}`)

    c.strokeStyle = "#FFFFFF";
    c.lineWidth = 5;

    console.log(c);

    img.css({
        filter: 'invert(100%)',
        invert: 100
    })

    let t = 1;

    let points = thunderbolt.map(coords => {
        return [coords[0] * 4.5, coords[1] * 4.5];
    })

    function animate(next) {
        if (t < points.length) {
            window.requestAnimationFrame(() => { animate(next) });
        } else {
            window.requestAnimationFrame(() => { next() });
            return;
        }
        // console.log('frame ' + t, points.length);
        c.beginPath();
        c.moveTo(points[t - 1][0], points[t - 1][1]);
        c.lineTo(points[t][0], points[t][1]);

        // Draw up to 3 segments per frame;
        for (let i = t + 1; i < t + 3; i++) {
            if (i < points.length) {
                c.lineTo(points[i][0], points[i][1]);
            }
        }

        t+=3;

        c.stroke();
    }

    animate( // Draw the first bolt
        () => {

            points = thunderbolt.map(coords => { // vertices for third bolt
                return [(20 - coords[0]) * 4.5 + 160, coords[1] * 4.5];
            });

            t = 1;
            animate( // Draw the second bolt
                () => {

                    points = thunderbolt.reverse().map(coords => { // create vertices for second bolt
                        return [coords[0] * 4.5 + 80, (56 - coords[1]) * 4.5];
                    });

                    t = 1;
                    animate(flash) // Draw third bolt; flash when done
                }
            );
        }
    );

    function tweenInvert() {
        console.log(this.invert);
        img.css({
            filter: `invert(${this.invert}%)`
        })
    }

    function flash() {
        // img.animate({ invert: 0 }, {
        $({invert: 100}).animate({invert: 0}, {
            duration: 100,
            easing: 'linear',
            step: tweenInvert,
            done: function() {
                $({invert: 0}).animate({ invert: 100 }, {
                    duration: 100,
                    easing: 'linear',
                    step: tweenInvert,
                    done: function() {
                        $({invert: 100}).animate({ invert: 0 }, {
                            duration: 100,
                            easing: 'linear',
                            step: tweenInvert,
                            done: function() {
                                img.css({
                                    filter: 'invert(0%)'
                                })
                                retraceBolt();
                            }
                        })
                    }
                })
            }
        })
    }
    
    function retraceBolt() {
        c.globalCompositeOperation = "destination-out";
        c.lineWidth = 6;
        points = thunderbolt.reverse().map(coords => {
            return [coords[0] * 4.5, coords[1] * 4.5];
        });
        t = 1;
        animate( // Draw the first bolt
            () => {
                
                points = thunderbolt.map(coords => { // vertices for third bolt
                    return [(20 - coords[0]) * 4.5 + 160, coords[1] * 4.5];
                });
                
                t = 1;
                animate( // Draw the second bolt
                    () => {
                        
                        points = thunderbolt.reverse().map(coords => { // create vertices for second bolt
                            return [coords[0] * 4.5 + 80, (56 - coords[1]) * 4.5];
                        });
                        
                        t = 1;
                        animate(
                            () => {
                                c.globalCompositeOperation = "source-over"
                                thunderbolt.reverse();
                                jc.remove();
                            }
                        ) // Draw third bolt; flash when done
                    }
                );
            }
        );
    }
}





const displayBuffer = [];

$(document).ready(function() {
    main.initialize();

    main.char = main.combatants["Obi Wan"];
    main.enemy = main.combatants["Darth Maul"];



    // Battle events

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
            displayBuffer.push({
                text: `${main.enemy.name} is defeated.`,
                animation: () => {
                    defeatAnimation('enemy');
                }
            });
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