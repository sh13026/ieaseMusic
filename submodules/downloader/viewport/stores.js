
import { observable, action, autorun } from 'mobx';
import storage from 'common/storage';

class Stores {
    @observable tasks = [];
    @observable mapping = {};

    constructor() {
        autorun(
            () => {
                var mapping = this.mapping;
                var tasks = [];

                tasks = Object.keys(mapping).map(
                    (e, index) => {
                        return mapping[e];
                    }
                );

                this.tasks = tasks;
            },
            { delay: 1000 }
        );
    }

    @action.bound
    load = async() => {
        try {
            var mapping = await storage.get('tasks');
            this.mapping = mapping;
        } catch (ex) {
            storage.remove('tasks');
            this.mapping = {};
        }
    }

    @action.bound
    updateTask = (task) => {
        this.mapping[task.id] = task;
    }

    @action.bound
    doneTask = (task) => {
        var mapping = {};

        this.updateTask(task);

        this.tasks.map(
            e => {
                if (e.progress === 1) {
                    mapping[e.id] = e;
                }
            }
        );

        // Immediate modify the object without delay, then save to storage
        mapping[task.id] = task;
        storage.set('tasks', mapping);
    }

    @action.bound
    removeTask = (item) => {
        delete this.mapping[item.id];
    }
};

export default new Stores();
