## ES6 Mixins

An easy way to add mixin methods and functions to your es6 classes and react components.

#### Installation and Usage:

```bash
npm install es6-mixins
```

Import mixins into your project:

```javascript
import mixins from 'es6-mixins';
```

mixins has 3 arguments

```javascript
mixins([a function, an array, or a class], context, options);
```

Only the first 2 arguments are required. 

* The first argument can be either a function, an array (containing classes or functions), or a class. 
* The second argument is the context on which to add these methods, if used in the constructor it should be set as this. 

The simplest example just adds someFunction to yourClass below.

```javascript
class YourClass {
	constructor(){
		mixins(somefunction, this);
	}
}
```

#### Options Object:

The third argument is an options object that can look like this:

```javascript
{	
	"warn": true // defaults to true	
	"mergeDuplicates": true // defaults to true
}
```

* **warn** If set to true (default) it will warn you when there are two conflicting methods that aren't [react lifecycle methods](https://facebook.github.io/react/docs/component-specs.html).
* **mergeDuplicates** If set to true (default), this will merge two conflicting methods and call the second one first.


## Further Examples:

**Mixing in multiple classes:**

```javascript
import mixins from 'es6-mixins';

// The first class to be used as a mixin
class TestMixin1 {
	testMethod1(){
    	console.log('test Method 1 from TestMixin1');
    }
    
    testMethod2(){
    	console.log('test Method 2 from TestMixin2');
    }
}

// The second class to be used as a mixin
class TestMixin2 {
	testMethod1(){
    	console.log('test Method 1 from TestMixin2');
    }
}

class MainClass {
	constructor(){
    	mixins([TestMixin1, TestMixin2], this);
        testMethod1() // outputs 'test Method 1 from TestMixin2' and then 'test Method 1 from TestMixin1' will warn in console about duplicate methods.
    }
}
```


**Mixing in a function**:

```javascript
import mixins from 'es6-mixins';

// A function to add as a mixin
function testFunction(){
	console.log('test function');
}

class MainClass {
	constructor(){
    	mixins(testFunction, this);
        testFunction() // outputs 'test function'
    }
}
```