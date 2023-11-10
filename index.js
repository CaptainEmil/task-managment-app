"use strict";

console.clear();


function Task(description, cost) {
    if (new.target !== IncomeTask && new.target !== ExpenseTask) {
        throw new Error("Function constructor Task cannot be invoked with 'new'");
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

class IncomeTask extends Task {

    constructor(description, cost) {
        super(description, cost);
    }

    makeDone(budget) {
        // budget.income + cost
    }

    makeUnDone(budget) {
        // budget.income - cost
    }

}

class ExpenseTask extends Task {

    constructor(description, cost) {
        super(description, cost);
    }


    makeDone(budget) {
        // budget.expenses + cost
    }

    makeUnDone(budget) {
        // budget.expenses - cost
    }
}

class TasksController {
    #tasks;
    #areTasksDone;

    constructor(tasks) {
        this.#tasks = [...tasks];
        this.#areTasksDone = Array(tasks.length).fill(false);
    }

    

    addTasks(...tasks) {
        for (let task of tasks) {
            let boolArr = this.#tasks.map(x => x.id === task.id ? false : true);
            if (!boolArr.includes(false)) {
                this.#tasks.push(task);
            }
        }
    }

    getTasks() {
        return [...this.#tasks];
    }

    getAreTasksDone() {
        return [...this.#areTasksDone];
    }

    getTasksSortedBy(string) {
        let arr = [...this.#tasks];
        
        if (string === 'description') {
            arr.sort(function (a, b) {
                if (a.description > b.description) {
                    return 1;
                }
                if (a.description < b.description) {
                    return -1;
                }
                return 0;
            });
        }
        else if (string === 'cost') {
            arr.sort(function (a, b) {
                return a.cost - b.cost;
            });
        }
        else if (string === 'status') {
            let arrOfStatus=[...this.#areTasksDone];
            arr.sort(function (a, b) {
                const aIsDone=arrOfStatus[arr.indexOf(a)];
                const bIsDone=arrOfStatus[arr.indexOf(b)];
                if (bIsDone === aIsDone) {
                    return 0;
                }
                if (bIsDone) {
                    return 1;
                }
                if (aIsDone) {
                    return -1;
                }
            });
        }
        return arr;
    }

    getFilteredTasks(obj) {
        let arr = [...this.#tasks];
        let tempArr = [...this.#tasks];

        if (obj.description !== undefined) {
            for (let task of arr) {
                if (task.description !== obj.description) {
                    tempArr.splice(tempArr.indexOf(task), 1);
                }
            }
            arr = [...tempArr];
        }
        if (obj.isIncome !== undefined) {
            if (obj.isIncome) {
                for (let task of arr) {
                    let index = tempArr.indexOf(task);
                    if (!task instanceof IncomeTask) {
                        tempArr.splice(index, 1);
                    }
                }
            }
            else {
                for (let task of arr) {
                    let index = tempArr.indexOf(task);
                    if (!task instanceof ExpenseTask) {
                        tempArr.splice(index, 1);
                    }
                }
            }
            arr = [...tempArr];
        }
        if (obj.isCompleted !== undefined) {
            if (obj.isCompleted) {
                for (let task of arr) {
                    let index = tempArr.indexOf(task);
                    let taskIsDone=this.#areTasksDone[index];
                    if (!taskIsDone) {
                        tempArr.splice(index, 1);
                    }
                }
            }
            else {
                for (let task of arr) {
                    let index = tempArr.indexOf(task);
                    let taskIsDone=this.#areTasksDone[index];
                    if (taskIsDone) {
                        tempArr.splice(index, 1);
                    }
                }
            }
            arr = [...tempArr];
        }
        return arr;
    }
}

// let task=new IncomeTask('car',200);
// let arr=[task];
// for(let i=0; i<10;i++){
//     arr.push(new ExpenseTask('clone', i*10));
// }
// let tasksController=new TasksController(arr);

// let obj={
//     description: 'car',
//     isIncome:true,
//     isCompleted: false
// }

// console.log(tasksController);
// console.log(tasksController.getAreTasksDone());
// console.log(tasksController.getTasksSortedBy('status'));
// console.log(tasksController.getFilteredTasks(obj));