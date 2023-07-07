# 제너레이터 
 - 일반함수는 하나의 값(혹은 0개의 값)만을 반환하지만 제너레이터를 이용하면 여러 개의 값을 필요에 따라 하나씩 반환(yield)할 수 있다.
 - 제너레이터와 이터러블 객체를 함께 사용하면 손쉽게 데이터 스트림을 만들 수 있다.

## 제너레이터 함수 
제너레이터 생성을 위해 '제너레이터 함수'를 이용하며 <mark>function*</mark>이 필요하다.  

```javascript
function* generatorSequence(){
    yield 1;
    yield 2;
    return 3;
}
```
제너레이터 함수를 호출하면 코드가 실행되지 않고, '제너레이터 객체'를 반환

```javascript
function* generatorSequence(){
    yield 1;
    yield 2;
    return 3;
}

let generator = generatorSequence(); // [object Generator] 
```

## 제너레이터 주요 메서드

- next  
가장 가까운 <mark>yield \<value\></mark>문을 만날 때까지 코드를 실행 후 멈추고 <mark>value</mark>가 바깥 코드로 전달됨. 

next는 항상 아래 두 프로퍼티를 가진 객체를 반환.
- value:산출 값
- done :함수 코드 실행 완료여부를 나타내는 boolean 완료 시 true
  
```javascript
function* generatorSequence(){
    yield 1;
    yield 2;
    return 3;
}

const gen = generatorSequence();
// 코드는 처음 yield를 만난 줄에서 멈추고 해당 값이 1을 value로 전달
// 완료 여부를 나타내는 done은 false
const won = gen.next();
JSON.stringity(won); // {value:1, done:false}

```

## 제너레이터와 이터러블

next메서드를 보면 짐작할 수 있듯이, 제너레이터는 <mark>이터러블</mark>  
따라서 for...of반복을 통해 접근이 가능

```javascript
function* generatorSequence(){
    yield 1;
    yield 2;
    return 3;
}

for( let r of generatorSequence) {
    console.log(r); // 1, 2가 출려됨.
}
```
next().value를 이용한 방법보다 편리하지만 마지막 return값이 3은 확인되지 않는데 <mark>done에 상태가 true일 경우는 무시</mark>하기 때문으로 출력되길 원하는 값은 yield로 반환해야 된다.

## 이터러블을 이용해 제너레이터 대체 
iterable인터페이스를 만족하면 제너레이터와 동일하게 사용이 가능 

```javascript

const range = {
    from :1,
    to:5,
    [Symbol.iterator](){
        return {
            current:this.from,
            last:this.to,
            next(){
                if(this.current<=this.last){
                    return {done:false, value:this.current++};
                } else {
                    return {done:true};
                }
            }
        }
    }
}

console.log([...range]);//1,2,3,4,5
``` 

## 제너레이터 컴포지션 
제너레이터 안에 제너레이터를 임베딩(embedding, composing)할 수 있게 해주는 제너레이터의 특별 기능.  

<mark>yield*</mark>문을 이용해 실행을 다른 제너레이터에 위임(delegate)

```javascript
function* generateSequence( start, end ){
    for(let i=start; i<end; i++){
        yield i;
    }
}

function* generatePasswordCodes(){

    //0-9
    yield* generateSequence(48, 57);
    //A-Z
    yield* generateSequence(65, 90);
    //a-z
    yield* generateSequence(97, 122);

}

let str='';
for( let code of generatePasswordCodes() ){
    str+= String.fromCharCode(code);
}

console.log(str)

```


## yield를 이용한 제너레이터 안∙밖으로 정보 교환하기  

<mark>yield와 next</mark>를 이용해 결과를 바깥으로 전달할 뿐만 아니라 값을 제너레이터 안으로 전달가능. 
- <mark>generator.next(args)</mark> 이때 인수 args는 yield의 결과가 된다.

```javascript

function* gen(){
    let result = yield "2+2 =?";
    console.log(result);
}

let generator = gen();
let question = generator.next().value;
console.log('q', question);
generator.next(4);
```

## generator.throw 
제너레이터 실행 중 에러를 만들어 던질 수 있는데 이때 throw를 사용.

```javascript

function* gen(){

    try{
        let result = yield '2+2=?';
        console.log('throw가 발생하면 여기는 실행되지 않음.');
    }catch(e){
        console.log(e);
    }
} 

const generator = gen();
const question = generator.next().value;
console.log(question);
generator.throw(new Error("에러 발생!"));
```

## 응용 
 - yield를 이용해 값을 내려줄지 yield를 이용해 값을 당겨 올지를 정하고 일관된 방식으로 사용하는게 코드 일관성에 좋음.
 - 형식이 어떻게 되든 중첩 함수를 통해 데이터 가공을 하고 원하는 결과를 얻을 수 있음.
 - 내려받는 형식은 이를 사용하는 곳에서 원하는 행동을 결정할 수 있다는 장점이 있음.
 - 당겨오는 형식은 값에 유효성을 체크하기 위해 while과 try, finally를 통해 마지막을 체크하는 처리가 필요.