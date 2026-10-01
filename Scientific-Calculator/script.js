const screen = document.getElementById('screen');
const expressionView = document.getElementById('expression-view');
const modeIndicator = document.getElementById('mode-indicator');
const degBtn = document.getElementById('deg-btn');

let isDegree = true;

function toggleDegRad() {
    isDegree = !isDegree;
    modeIndicator.innerText = isDegree ? 'DEG' : 'RAD';
    degBtn.innerText = isDegree ? 'DEG' : 'RAD';
}

function appendValue(val) {
    if (screen.value === 'Error') screen.value = '';
    screen.value += val;
    scrollToEnd();
}

function appendFunction(func) {
    if (screen.value === 'Error') screen.value = '';
    screen.value += func;
    scrollToEnd();
}

function clearDisplay() {
    screen.value = '';
    expressionView.innerText = '';
}

function deleteChar() {
    if (screen.value === 'Error') {
        screen.value = '';
    } else {
        screen.value = screen.value.slice(0, -1);
    }
}

function scrollToEnd() {
    screen.scrollLeft = screen.scrollWidth;
}

function trigSin(x) {
    return isDegree ? Math.sin(x * Math.PI / 180) : Math.sin(x);
}

function trigCos(x) {
    return isDegree ? Math.cos(x * Math.PI / 180) : Math.cos(x);
}

function trigTan(x) {
    return isDegree ? Math.tan(x * Math.PI / 180) : Math.tan(x);
}

function factorial(n) {
    if (n < 0 || !Number.isInteger(n)) return NaN;
    if (n === 0 || n === 1) return 1;
    let res = 1;
    for (let i = 2; i <= n; i++) res *= i;
    return res;
}

function calculate() {
    try {
        let rawExpression = screen.value;
        if (!rawExpression) return;

        expressionView.innerText = rawExpression.replace(/Math\.PI/g, 'π').replace(/Math\.E/g, 'e');

        let parsed = rawExpression;

        parsed = parsed.replace(/(\d)(\()/g, '$1*(');
        parsed = parsed.replace(/(\))(\d)/g, '$1*$2');
        parsed = parsed.replace(/(\d)(Math\.)/g, '$1*$2');

        parsed = parsed.replace(/sin\(/g, 'trigSin(');
        parsed = parsed.replace(/cos\(/g, 'trigCos(');
        parsed = parsed.replace(/tan\(/g, 'trigTan(');

        parsed = parsed.replace(/log\(/g, 'Math.log10(');
        parsed = parsed.replace(/ln\(/g, 'Math.log(');
        parsed = parsed.replace(/sqrt\(/g, 'Math.sqrt(');
        parsed = parsed.replace(/fact\(/g, 'factorial(');

        parsed = parsed.replace(/%/g, '/100');

        let result = Function('"use strict"; return (' + parsed + ')')();

        if (result !== undefined && !isNaN(result) && isFinite(result)) {
            screen.value = parseFloat(result.toFixed(10)).toString();
        } else {
            screen.value = 'Error';
        }
    } catch (err) {
        screen.value = 'Error';
    }
}

document.addEventListener('keydown', (e) => {
    if ((e.key >= '0' && e.key <= '9') || e.key === '.') appendValue(e.key);
    else if (['+', '-', '*', '/', '(', ')', '%'].includes(e.key)) appendValue(e.key);
    else if (e.key === 'Enter') { e.preventDefault(); calculate(); }
    else if (e.key === 'Backspace') deleteChar();
    else if (e.key === 'Escape') clearDisplay();
});
