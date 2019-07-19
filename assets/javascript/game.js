let combatants; // Dictionary of combatant names and fighter objects

const main = {
    initialize() {
        combatants = { // fill combatants with a fresh array of fighters when we initialize
            "Obi Wan": new Fighter("Obi Wan", 120, 8, 20),
            "Darth Maul": new Fighter("Darth Maul", 180, 5, 25),
            "Luke Skywalker": new Fighter("Luke Skywalker", 100, 10, 5),
            "Darth Sidious": new Fighter("Darth Sidious", 150, 6, 15)
        };
        this.state = 'character select';

        const stage = $('#stage');
        for (const name in combatants) {
            stage.append(makeCard(combatants[name]));
        }

        $('#game').on('click', '.fighter', cardListener);

        $('#message').text('Choose your fighter');
    },
    char: '',
};


function makeCard(fighter) {
    console.log(fighter);
    return $('<div>').addClass('card fighter p-1 col-6 col-md-3').attr('value', fighter.name).append(
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
            $(this).detach().removeClass('col-6 col-md-3').appendTo('#your-character');
            main.state = 'oponent select';
            char = combatants[event.currentTarget.value];
            $('#message').text('Choose your opponent');
            return;
        case 'oponent select':
            if (event.currentTarget.value != main.char) {
                $(this).detach().removeClass('col-6 col-md-3').appendTo('#defender');
                $('#message').text('Fight!');
                main.state = 'combat';

                $('#stage').detach().appendTo('#game');
            }

    }
}


$(document).ready(function () {
    main.initialize();



});