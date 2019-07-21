let combatants; // Dictionary of combatant names and fighter objects

const main = {
    initialize() {
        this.combatants = { // fill combatants with a fresh array of fighters when we initialize
            "Obi Wan": new Fighter("Obi Wan", 120, 8, 20),
            "Darth Maul": new Fighter("Darth Maul", 180, 5, 25),
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
        $(`#${main.enemy.replace(' ','')}`).remove();
        main.state = 'opponent select';
    } else if (main.combatants[main.char].HP <= 0) {
        console.log('You lose');
    }
    $(`#${main.char.replace(' ','')}>.card-body>.card-text`).text(main.combatants[main.char].HP);
    $(`#${main.enemy.replace(' ','')}>.card-body>.card-text`).text(main.combatants[main.enemy].HP);
}


$(document).ready(function() {
    main.initialize();

    main.char = main.combatants["Obi Wan"];
    main.enemy = main.combatants["Darth Maul"];

    displayBuffer = [];


    // Battle events

    //TODO add display buffer to queue messages, only display battle menu when all text is displayed
    $('.battle-display').on('click', function() {
        $('.battle-display').empty();
        $('.battle-menu').toggle();

    })

    $('.battle-menu #fight').on('click', function(event) {
        main.char.attackTarget(main.enemy);
        $('.battle-display').text(`${main.char.name} attacks ${main.enemy.name} for ${main.char.attack * (main.char.level - 1)} damage.`)
        $('.stats.player .level').text(`Lv${main.char.level}`);
        $('.battle-menu').toggle();
    })



});