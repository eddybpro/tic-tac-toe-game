const cellElements = document.querySelectorAll('.cell'),
msgContainer = document.querySelector('.msg-container'),
msgTxt = document.querySelector('.msg'),
restartBtn = document.querySelector('.restart-btn'),
main = document.querySelector('main'),
themeBtn = document.getElementById('theme-check'),
iconTheme = document.getElementById('icon'),
huScorePara = document.querySelector('.your-score'),
aiScorePara= document.querySelector('.ai-score'),
huPlayer = 'x',
aiPlayer = 'o',
winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

let huIndex,
huList,
aiList=[],
skipList=[],
huScore=0,
aiScore =0,
skip;

let flag=localStorage.getItem('flag') || 1;

if(flag == 0){
    switchTheme();
    iconTheme.src = './images/sun-icon.svg';
}

themeBtn.addEventListener('click', switchTheme);
iconTheme.addEventListener('click', ()=>{
    themeBtn.click();
    if(flag == 1){
        iconTheme.src = './images/sun-icon.svg';
        flag=0;
        localStorage.setItem('flag', JSON.stringify(flag));
    }else{
        iconTheme.src = './images/moon-icon.svg';
        flag=1;
        localStorage.setItem('flag', JSON.stringify(flag));
    }
})

function switchTheme(){
    main.classList.toggle('switch');
}



restartBtn.addEventListener('click', startGame);

startGame();

function startGame(){
    huList = winCombos.map(list=>list.slice())
    aiList=[];
    huScorePara.innerText = `${huScore}`;
    aiScorePara.innerText = `${aiScore}`;
    document.querySelector('.confetti').style.display='none';

    msgContainer.style.display = 'none';
    cellElements.forEach(cell=>{
        cell.classList.remove(huPlayer);
        cell.classList.remove(aiPlayer);
        cell.innerText='';
        cell.addEventListener('click', clickedCell, {once:true});
    })
}

function clickedCell(cell){
    if(cell.target){
        turn(cell.target.id, huPlayer);
        
        if (!checkWin() && !checkTie()){
            turn(bestSpot(), aiPlayer)
        };
    }
}

function turn(index, player){
    if(player == huPlayer)huIndex = index;

    [...cellElements][index].innerText = player;
    [...cellElements][index].classList.add(player);
    [...cellElements][index].removeEventListener('click', clickedCell, {once:true})
    checkWin();
    if(checkWin() == huPlayer){
        huScore++;
    }else if(checkWin() == aiPlayer){
        aiScore++;
    }
}

function checkWin(){
    const ishuPlayerWin = winCombos.some(com=>com.every(idx =>{
        return cellElements[idx].classList.contains(huPlayer);
    }));

    const isaiPlayerWin = winCombos.some(com=>com.every(idx =>{
        return cellElements[idx].classList.contains(aiPlayer);
    }));

    if(isaiPlayerWin){
        declareWinner('You Lose.')
        return aiPlayer;
    }else if(ishuPlayerWin){
        declareWinner('You Won!')
        document.querySelector('.confetti').style.display='flex';
        return huPlayer;
    }
}

function declareWinner(player){
    msgContainer.style.display = 'flex';
    msgTxt.innerText = player;
}

function emptySquares(){
    const arr = [];
    cellElements.forEach((cell, idx)=>{
        if(cell.innerText === ''){
            arr.push(idx);
        }
    })
    
    return arr;
}

function bestSpot(){

    for (let i = 0; i < huList.length; i++) {
        if(huList[i].indexOf(+huIndex)>-1){
            huList[i].splice(huList[i].indexOf(+huIndex),1)
        }
    }
    huList = huList.sort((a, b)=>a.length - b.length)
    
    for (let i = 0; i < 8; i++) {
        for (let j = 1; j >= 0; j--) {
            if((emptySquares().indexOf(huList[i][j])>-1) && (aiList.indexOf(huList[i][j])==-1)){
                aiList.push(huList[i][j])
                
                if(aiList.length==3){
                    const bestArr = winCombos.find(lst =>(lst.indexOf(aiList[0])>-1) && (lst.indexOf(aiList[1])>-1));

                    if(bestArr){
                        for (let i = 0; i < bestArr.length; i++) {
                            if((aiList.indexOf(bestArr[i])==-1) && (emptySquares().indexOf(bestArr[i])>-1)){
                                return bestArr[i];
                            }
                        }
                    }
                    
                }
                skipList.push(+huIndex, huList[i][j]);
                
                if(huList[i][j] === listFun(skipList))continue;
                return huList[i][j];
            }
        }
        
    };
    
}

function listFun(arr){
    const list = winCombos.find(lst =>(lst.indexOf(arr[0])>-1) && (lst.indexOf(arr[1])>-1));
    if(list){
        for (let i = 0; i < list.length; i++) {
            if((arr.indexOf(list[i])==-1) && (emptySquares().indexOf(list[i])>-1)){
                return list[i];
            }
        }
    }
}

function checkTie(){
    if(emptySquares().length == 0){
        cellElements.forEach(cell=>{
            cell.removeEventListener('click', clickedCell, {once: true})
        })
        declareWinner('Draw')
        return true;
    }
    return false;
}