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
        this.HP -= target.defend(this.attack * this.level);
        this.level++;
        console.log(target.HP <= 0);
        return target.HP <= 0;
    }

    // Process incoming attack and return counter damage if still alive;
    defend(damage) {
        this.HP -= damage;
        if (this.HP <= 0) {
            const event = new CustomEvent('dies', { detail: this.name });
            // $('#game').dispatchEvent(event);
            return 0; // no counter attack since we died
        }
        return this.counter;
    }

    get id() {
        return this.name.toLowerCase().replace(' ', '-');
    }
}