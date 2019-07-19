let combatants; // Dictionary of combatant names and fighter objects

const main = {
    initialize() {
        combatants = { // fill combatants with a fresh array of fighters when we initialize
            "Obi Wan": new Fighter("Obi Wan", 120, 8, 20),
            "Darth Maul": new Fighter("Darth Maul", 189, 5, 25),
            "Luke Skywalker": new Fighter("Luke Skywalker", 100, 10, 5),
            "Darth Sidious": new Fighter("Darth Sidious", 150, 6, 15)
        };
        this.state = 'character select';
        combatants.forEach(fighter => {
            
        });
    },
};

{/* <div class="card" style="width: 18rem;">
    <img class="card-img-top" src="..." alt="Card image cap">
        <div class="card-body">
            <h5 class="card-title">Card title</h5>
            <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            <a href="#" class="btn btn-primary">Go somewhere</a>
        </div>
</div> */}


function makeCard(fighter) {
    $('<div>').addClass('card fighter').addValue(fighter.name).appendChild(
        $('<img>').attr('src', '../images/Obi Wan.png')
    ).appendChild(
        $('<div>').addClass('card-body').appendChild(
            $('<h5>').addClass('card-title').text(fighter.name)
        ).appendChild(
            $('<p>').addClass('card-text').text(fighter.HP)
        )
    );
}


$(document).ready(function () {
    main.initialize();

});