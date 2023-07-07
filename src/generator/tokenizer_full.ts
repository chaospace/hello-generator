

const END_OF_SEQUENCE = Symbol();

function getNextItem<T>( iterator:Iterator<T> ){
    const result = iterator.next();
    return result.done ? END_OF_SEQUENCE : result.value;
}

function isWordChar( ch:unknown ) {
    return  typeof ch==='string' && /^[a-zA-Z0-9]$/.test(ch);
}


function* tokenize(chars:string) {
    const iter = chars[Symbol.iterator]();
    let ch:string|typeof END_OF_SEQUENCE = '';
    do{
        ch = getNextItem(iter);
        if(isWordChar(ch)){
            let word='';
            while(isWordChar(ch)){
                word+=ch.toString();
                ch = getNextItem(iter);
            };
            yield word;
        }
    } while( ch !== END_OF_SEQUENCE );
}

function* extractNumber<T extends string>(words:Generator<T>) {
    for(let word of words ){
        if(/^[0-9]+$/.test(word)){
            yield Number(word);
        }
    }
}

function summarize<T extends number>(numbers:Generator<T>) {
    let result = 0;
    for(let n of numbers){
        result+=n;
    }
    return result;
}


export {
    tokenize,
    extractNumber,
    summarize
}