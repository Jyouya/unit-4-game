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
    attack(target) {
        this.HP -= target.defend(this, this.attack * this.level);
        this.level++;
    }

    // Process incoming attack and return counter damage if still alive;
    defend(attacker, damage) {
        this.HP -= damage;
        if (HP <= 0) {
            const event = new CustomEvent('dies', { detail: this.name } );
            Element.dispatchEvent(event);
            return 0; // no counter attack since we died
        }
        return this.counter; 
    }
}
