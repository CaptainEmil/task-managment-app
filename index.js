"use strict";

console.clear();


function Task(description, cost) {
    if (new.target) {
        throw new Error('Task cannot be called with "new"');
    }
    if (cost < 0) {
        throw new Error('Cost cannot be negative');
    }
    const _id = "id" + Math.random().toString(16).slice(2);
    const _description = description;
    const _cost = cost;

    Object.defineProperties(this, {
        id: {
            get() {
                return _id;
            }
        },
        description: {
            get() {
                return _description;
            }
        },
        cost: {
            get() {
                return _cost;
            }
        }
    })
}