




/**
 * 푸시방식 처리를 위한 wrapper함수
 * @param generatorFunc : 제너레이터함수
 * @returns 
 */
function coroutine( generatorFunc:GeneratorFunction ) {
    return function(...args:any[]) {
        const generator = generatorFunc(...args);
        generator.next();
        return generator;
    } 
}


function sender<T>( source:Iterable<T>, receiver:Generator<T>) {
    for(let x of source){
        receiver.next(x);
    }
    receiver.return(null); // end of stream
}


const logItems = coroutine(function* (){
    try{
        while(true){
            let item = yield;
            console.log(item);
        }
    } finally {
        console.log('DONE');
    }
} as GeneratorFunction);


const isWordChar = (char:string) => {
    return typeof char === 'string' && /^[a-zA-Z0-9]$/.test(char);
}



/**
 * yield로 넘어오는 값에 유효성을 체크하기 위해 try finally를 이용.
 */
const tokenizeWithCoroutine = coroutine(function* ( receiver:Generator ){

    try{
        while(true){
           let ch:any = yield; 
            if(isWordChar(ch)){
                let word = '';
                try{
                    while(isWordChar(ch)){
                        word+=ch.toString();
                        ch = yield;
                    }

                }finally{
                    receiver.next(word);
                }
            }
        }
    } finally {
        receiver.return(null);
    }


} as GeneratorFunction);

const extractNumberWithCoutine = coroutine(function* (receiver:Generator){

    try{

        while(true){
            let word = yield;
            if(/^[0-9]+$/.test(word as string)) {
                console.log('숫자!', word);
                receiver.next(Number(word));
            }
        }

    } finally {
        receiver.return(null);
    }

} as GeneratorFunction);


const summarizeWithCoroutine = coroutine(function* (receiver:Generator){
    let sum = 0;
    try{
        while(true){
            let item =yield;
            sum+=Number(item);
        }
        
    } finally {
        console.log('최종!!', sum);
        receiver.next(sum);
        receiver.return(null); //end of stream 
    }
} as GeneratorFunction)


export {coroutine, sender, logItems, tokenizeWithCoroutine, extractNumberWithCoutine, summarizeWithCoroutine};