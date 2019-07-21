class Fighter {
    constructor(name, health, attack, counter) {
        this.name = name;
        this.maxHP = health,
            this.attack = attack;
        this.counter = counter;
        // Start out at full HP
        this.HP = this.maxHP;
        this.level = 1;
    }

    // Attack a target and level up;
    attackTarget(target) {
        const counter = target.defend(this.attack * this.level);
        this.HP -= counter
        this.level++;
        return counter; // falsey if enemy died, amount of damage we took if not
    }

    // Process incoming attack and return counter damage if still alive;
    defend(damage) {
        this.HP -= damage;
        // if (this.HP <= 0) {
        //     // const event = new CustomEvent('dies', { detail: this.name });
        //     return 0; // no counter attack since we died
        // }
        return this.HP > 0 ? this.counter : 0;
    }

    get id() {
        return this.name.toLowerCase().replace(' ', '-');
    }
}