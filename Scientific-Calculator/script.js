const screen = document.getElementById('screen');

function appendValue(val) {
    screen.value += val;
}

function appendFunction(func) {
    screen.value += func;
}

function clearDisplay() {
    screen.value = '';
}

function deleteChar() {
    screen.value = screen.value.slice(0, -1);
}

function calculate() {
    try {
        let expression = screen.value;
        expression = expression.replace(/sin\(/g, 'Math.sin(');
        expression = expression.replace(/cos\(/g, 'Math.cos(');
        expression = expression.replace(/tan\(/g, 'Math.tan(');
        expression = expression.replace(/log\(/g, 'Math.log10(');
        expression = expression.replace(/sqrt\(/g, 'Math.sqrt(');

        let result = eval(expression);
        if (result !== undefined) {
            screen.value = Number.isInteger(result) ? result : result.toFixed(6).replace(/\.?0+$/, '');
        }
    } catch (error) {
        screen.value = 'Error';
        setTimeout(() => { clearDisplay(); }, 1500);
    }
}