const sayHello = () => {
    console.log("hello");
}

function printArray() {
    let array = [];
    for (let i = 0; i < 10; i++) {
        array[i] = 0;
    }
    console.log(array);
    console.log(array[5]);
}

sayHello();
printArray;