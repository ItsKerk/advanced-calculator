//Screen - Input and Text above it
const inputfield = document.querySelector(".Input");
const previousCalc = document.querySelector('.PreviousCalc');   

const operators = ['+', '-', '×', '÷'];
const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

//Numbers
const bntNumbers = document.querySelectorAll('.number');

bntNumbers.forEach(element => { 
    element.addEventListener("click", selectNumbers);
});

function selectNumbers(event) {
    const number = event.target.textContent;
    const lastChar = inputfield.value.slice(-1); //Get the last character

    //Clear input
    if(isClearAll){
        inputfield.value = 0;
        previousCalc.innerHTML = '';
        isClearAll = false;
    }
    
    //Prevent entering "0" if input is already "0"
    if((inputfield.value === '0' && number==='0')){
        return;
    }

    //Prevent entering multiple dots
    if (number === '.') { 
        //Get the current number segment by splitting at operators and parentheses
        const lastSegment = inputfield.value.split(/[\+\-\×\÷\(\)%]/).pop();

        if (lastSegment.includes('.')) return;
        
        //Adding 0.
        if(numbers.includes(lastChar) || inputfield.value === '0'){
            inputfield.value += number;
        }
        else if(['%',')'].includes(lastChar)){ 
            inputfield.value += `×0${number}`;  //Adding x automatically
        }
        else{
                inputfield.value += `0${number}`;
        }
        return;
    }

    //If input is "0" and the user clicks a number, replace it
    if(inputfield.value === '0'){
        inputfield.value = number;
    }
    else{
        if(['%',')'].includes(lastChar)){
            inputfield.value += `×${number}`;  //Adding x automatically
        }else{
            inputfield.value += number;
        }
    }

    //Ensure the last character is visible by scrolling to the right
    inputfield.scrollLeft = inputfield.scrollWidth;
}


//Operators
const bntOperator = document.querySelectorAll('.operator');

bntOperator.forEach(element => {
    element.addEventListener("click", selectOperator);
});

function selectOperator(event) {
    const operator = event.target.textContent;

    //Get the last character and last two characters
    const lastChar = inputfield.value.slice(-1);
    const last2Char = inputfield.value.slice(-2);

    //Stop when there are two consecutive operators or "(" followed by an operator
    if ((operators.includes(last2Char[0]) || last2Char[0] === '(') && operators.includes(last2Char[1])) {
        return;
    }
    
    if(operator=='-'){
        if (['+', '-'].includes(lastChar)) {
            //Replace the last operator if it's already an operator
            inputfield.value = inputfield.value.slice(0, -1) + operator;
        } 
        else {
            inputfield.value += operator;
        }
    }else{
        // Prevent adding operator directly after '('
        if(lastChar === '('){
            return;
        }

        if (operators.includes(lastChar)) {
            // Replace the last operator if it's already an operator
            inputfield.value = inputfield.value.slice(0, -1) + operator;
        } 
        else {
            inputfield.value += operator;
        }
    }

    //Reset clear
    isClearAll  = false;
    //Ensure the last character is visible by scrolling to the right
    inputfield.scrollLeft = inputfield.scrollWidth;
}


//Percent
const bntPercent = document.querySelector('#percent');

bntPercent.addEventListener("click", () =>{
    const percent = bntPercent.textContent;

    //Get the last character
    const lastChar = inputfield.value.slice(-1);

    //Prevent adding percent if the last character is an opening parenthesis
    if (lastChar === '(' ){
        return;
    }

    // Get the last two characters
    const last2Char = inputfield.value.slice(-2);

    //Swap operators
    if((!['+', '×' , '÷'].includes(last2Char[0])) && ['+', '×' , '÷'].includes(last2Char[1]) ){
        inputfield.value = inputfield.value.slice(0, -1) + percent; 
    }else{
        inputfield.value += percent;  
    }

    //Reset clear
    isClearAll  = false;
    //Ensure the last character is visible by scrolling to the right
    inputfield.scrollLeft = inputfield.scrollWidth;
});


//Parenthesis
let tempParOpen=0;
let tempParClose=0;

const bntParenthesis = document.querySelectorAll('.parenthesis');

bntParenthesis.forEach(element => {
    element.addEventListener("click", selectPar);
});

function selectPar(event) {
    const parenthesis = event.target.textContent;

    //Clear input
    if(parenthesis === '(' && isClearAll){
        inputfield.value = '';
        previousCalc.innerHTML = '';
        isClearAll = false;
    }
    
    //Cant close empty ()
    if (parenthesis === ')') {
        const lastChar = inputfield.value.slice(-1); //Get the last character
        if (lastChar === '(') {
            return; 
        }

        //Cannot close if there is an operator before
        if(['+','×','÷'].includes(lastChar)){
            return; 
        }
    }
    
    //Equal ( and )
    if (parenthesis === '(') {
        if(inputfield.value ==='0'){
            inputfield.value = '';
        }
        tempParOpen++;
        inputfield.value += parenthesis;
    } 
    else if (parenthesis === ')' && tempParOpen > tempParClose) {
        tempParClose++;
        inputfield.value += parenthesis;
    }

    //Ensure the last character is visible by scrolling to the right
    inputfield.scrollLeft = inputfield.scrollWidth;
}


//CE - DELETE
const bntDelete = document.querySelector('#deleteall');
let isClearAll  = false;

bntDelete.addEventListener("click", () =>{

    //Clear all
    if(isClearAll){
        isClearAll  = false;

        //Parenthesis refresh
        tempParOpen='';
        tempParClose='';
    
        //PreviousCalc refresh
        previousCalc.innerHTML = '';

        inputfield.value = 0;
    }

    //Reduce ( and ) temp
    const lastChar = inputfield.value.slice(-1);
    if(lastChar === '('){
        tempParOpen--;
    }else if (lastChar === ')'){
        tempParClose--;
    }

    //Normal delete behavior
    inputfield.value = inputfield.value.slice(0, -1);
    if (inputfield.value === '') {
        inputfield.value = 0;
    }
});


//Equal
const btnEqual = document.querySelector('#equal');

btnEqual.addEventListener("click", () => {
    try {
        //Replace × and ÷
        let replaceResult = '';
        for (let char of inputfield.value) {
            if (char === "×") {
                replaceResult += "*";  
            }else if(char === "÷"){
                replaceResult += "/";
            }
            else {
                replaceResult += char;
            }
        }

        //Math
        const result = math.evaluate(replaceResult);

        //Update the history text
        previousCalc.innerHTML = inputfield.value;

        //Format the result to show 11 decimal places
        const formattedResult = math.format(result, {precision: 12});

        //Fill HistoryPopUp
        let content = '';
        content += `<div class="HistoryText">${inputfield.value}=${formattedResult}</div>`;
        historyPopUp.innerHTML += content;

        //Update input
        inputfield.value = formattedResult;

        //Clear all boolean
        isClearAll = true;

        //Scroll to left after result
        inputfield.scrollLeft = 0;

    } catch (error) {

    }
});


//History
const historyPopUp = document.querySelector('.HistoryPopUp');
const btnHistoryIcon = document.querySelector('.HistoryIcon');

btnHistoryIcon.addEventListener("click", () => {
    const computedStyle = getComputedStyle(historyPopUp);

    //Toggle display
    if(computedStyle.display === 'none'){
        historyPopUp.style.display = 'flex';
    }else{
        historyPopUp.style.display = 'none';
    }

});

//Check if the click is outside the HistoryPopUp and not on the HistoryIcon
document.addEventListener('click', (event) => {
    if (!historyPopUp.contains(event.target) && !btnHistoryIcon.contains(event.target)) {
        historyPopUp.style.display = 'none';
    }
});


//HistoryText
//Attach the event listener to the parent element
historyPopUp.addEventListener('click', function(event) {
    //Check if the clicked element has the 'HistoryText' class
    if (event.target && event.target.classList.contains('HistoryText')) {
        selectHistoryText(event);
    }
});

function selectHistoryText(event){
    const history = event.target.textContent;

    let isResult = false;
    let calculation = '';
    let result = '';
    
    for (let char of history) {
        if (char === '=') {
            isResult = true;
            continue; //Skip the '=' character itself
        }
    
        if (isResult) {
            result += char; 
        } else {
            calculation += char;
        }
    }

    //Update PreviousCalc and inputfield
    previousCalc.innerHTML = calculation;
    inputfield.value = result;

    //Reset clear   
    isClearAll  = false;
}

