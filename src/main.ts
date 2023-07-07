import { extractNumber, summarize, tokenize } from './generator/tokenizer_full';
import { coroutine, extractNumberWithCoutine, logItems, sender, summarizeWithCoroutine, tokenizeWithCoroutine } from './generator/tokenizer_push';
import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <h1>제너레이터 스터디</h1>
  <p id="output"></p>
  <p id="gen_push"></p>
`


const output = document.querySelector('#output')!;
const genPush = document.querySelector('#gen_push')!;
const result = [summarize(extractNumber(tokenize('2 apples and 5 oranges')))];

output.textContent = result.join(' ');


const writeLog = coroutine(function* (){
  const result = []
  try{
    while(true){
      let item = yield;
      console.log('log-', item);
      result.push(item);
    }
  } finally { 
    console.log('end!!', result);
    genPush.textContent = result.join(' ');
  }

} as GeneratorFunction);

const input = '2 apples 5 oranges'
sender(input,  tokenizeWithCoroutine(extractNumberWithCoutine(summarizeWithCoroutine(writeLog()))));
