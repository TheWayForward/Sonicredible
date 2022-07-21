const lodash = require("lodash");

class ObjectHelper {

    static getArrayElementById(array, id) {
        if (!array.length) {
            return {
                is_empty: true,
                element: {}
            }
        } else {
            for (let i = 0; i < array.length; i++) {
                if (array[i].id === id) {
                    return {
                        is_empty: false,
                        found: true,
                        element: array[i]
                    }
                }
            }
            return {
                is_empty: false,
                found: false
            }
        }
    }

    static deleteArrayElementById(array, id) {
        if (!array.length) {
            return {
                is_empty: true,
                element: {}
            }
        } else {
            for (let i = 0; i < array.length; i++) {
                if (array[i].id === id) {
                    return {
                        is_empty: false,
                        found: true,
                        element: array.splice(i, 1)
                    }
                }
            }
            return {
                is_empty: false,
                found: false
            }
        }
    }

    static listToTree(list) {
        const map = {};
        const tree = [];
        list.forEach((item) => {
            item.label = item.name;
            map[item.id] = item;
        });
        list.forEach((item) => {
            const parent = map[item.parent_id];
            if (parent) {
                (parent.children || (parent.children = [])).push(item);
            } else {
                tree.push(item);
            }
        });
        return tree;
    }

    static cloneObject(obj = {}) {
        return lodash.cloneDeep(obj);
    }

    static objectEqual = (obj_1, obj_2) => lodash.isEqual(obj_1, obj_2);

    static findMost(arr) {
        let maxElement;
        let maxNum = 1;
        let obj = arr.reduce(function (p, k) {
            p[k] ? p[k]++ : p[k] = 1;
            if (p[k] > maxNum) {
                maxElement = k;
                maxNum++;
            }
            return p;
        }, {});
        return maxElement;
    }

}

module.exports = ObjectHelper;