# infrafo-web
Meet me online: video &amp; chat built with Next.js
based on: https://redux.js.org/usage/nextjs
```
npx create-next-app@latest infrafo-web --ts --tailwind --app --src-dir --eslint --import-alias "@/*"

npm i @reduxjs/toolkit react-redux

npm i -D prettier
```

### look at
```js
var math = require('mathjs');

x = [1, 2, 4];
y = [2, 3, 5];

X = math.matrix([math.ones(math.size(x)), x]);
Y = math.matrix(y);

/*
XT = math.transpose(X);
S  = math.multiply(X, XT)
Xi = math.multiply(XT, math.inv(S))
theta = math.multiply(Y, Xi);
*/

theta = math.eval("YX^T*inv(XX^T)", {X, Y});

console.log(theta.toString())
```
```js
const math = require('mathjs');

/**
 * Data as COLUMN vectors (N×1)
 * Points: (1,2), (2,3), (4,7)
 */
const x = math.matrix([[1], [2], [4]]);
const y = math.matrix([[2], [3], [7]]);

/**
 * Design matrix X = [1, x, x^2]  (size N×3)
 * - use element-wise power (dotPow), NOT matrix multiply
 */
const N    = x.size()[0];
const ones = math.ones(N, 1);
const x2   = math.dotPow(x, 2);                // element-wise square
const X    = math.concat(ones, x, x2, 1);      // concat by columns (axis=1)

/**
 * Ordinary Least Squares via normal equations:
 *   θ = (Xᵀ X)⁻¹ Xᵀ y
 * Prefer solving the linear system instead of forming an explicit inverse:
 *   (Xᵀ X) θ = Xᵀ y   →  θ = lusolve(XᵀX, Xᵀy)
 */
const Xt   = math.transpose(X);
const XtX  = math.multiply(Xt, X);
const XtY  = math.multiply(Xt, y);
const theta = math.lusolve(XtX, XtY);          // 3×1 column: [θ0, θ1, θ2]ᵀ

/**
 * Prediction: ŷ(x0) = [1, x0, x0²] · θ
 */
function predict(x0) {
  const row = math.matrix([[1, x0, x0 * x0]]); // 1×3
  return math.multiply(row, theta).get([0, 0]);
}

// Pretty print (optional)
console.log('X =\n',     math.format(X,     { precision: 4 }));
console.log('theta =\n', math.format(theta, { precision: 6 }));
console.log('y_hat(3) =', predict(3));
```

## Task description
```
https://math.stackexchange.com/questions/31097/a-lady-and-a-monster
```


## Reverse Between
```powershell
    public void reverseBetween(int m, int n) {
        if (this.head == null || m >= n) return;
        
        Node helperNode = new Node(0);
        helperNode.next = this.head; // ref to the Head
        
        Node preRunner = helperNode; // ref to the node before the Between
        
        for (int i = 0; i < m && preRunner.next != null; i++) {
            preRunner = preRunner.next;
        }
        
        if (preRunner.next == null) return;
        
        Node runner = preRunner.next;
        
        for(int i=0; i<n-m && runner.next != null; i++){
            Node toMove = runner.next;
            runner.next = toMove.next;
            toMove.next = preRunner.next;
            preRunner.next = toMove;
        };

            this.head = helperNode.next;
        };
```

## Partition DLL
```powershell
    public void partitionList(int x) {
        //   +===================================================+
        //   |               WRITE YOUR CODE HERE                |
        //   | Description:                                      |
        //   | - Partitions a doubly linked list around a value  |
        //   |   `x`.                                            |
        //   | - Nodes with values less than `x` come before     |
        //   |   nodes with values greater than or equal to `x`. |
        //   |                                                   |
        //   | Behavior:                                         |
        //   | - Uses two dummy nodes to build two sublists:     |
        //   |   one for < x, one for >= x.                      |
        //   | - Traverses the list, linking nodes to the        |
        //   |   appropriate sublist and updating prev pointers. |
        //   | - Joins the two sublists together.                |
        //   | - Updates the head and resets head.prev to null.  |
        //   +===================================================+
        Node dum1 = new Node(0);
        Node dum2 = new Node(0);
        Node tail1 = dum1;
        Node tail2 = dum2;
        
        Node curr = this.head;
        
        while(curr != null){
            Node next = curr.next;
            curr.prev = curr.next = null;
            
            if(curr.value < x){
                tail1.next = curr;
                curr.prev = tail1;
                tail1=curr;
            } else {
                tail2.next = curr;
                curr.prev = tail2;
                tail2=curr;
            }
            
            curr = next;
        }
        
        Node newHead;
        
        if(dum1.next != null){
            tail1.next = dum2.next;
            if(dum2.next != null){
                dum2.next.prev = tail1;
            }
            newHead = dum1.next;
        } else {
            newHead = dum2.next;
        }
        
        if(newHead != null) newHead.prev = null;
        this.head = newHead;
    }
```

## Reverse Between DLL
```java
public void reverseBetween(int startIndex, int endIndex) {
        //   +===================================================+
        //   |               WRITE YOUR CODE HERE                |
        //   | Description:                                      |
        //   | - Reverses a portion of a doubly linked list      |
        //   |   between two indices (inclusive range).          |
        //   | - Only nodes between startIndex and endIndex are  |
        //   |   reversed in place.                              |
        //   |                                                   |
        //   | Behavior:                                         |
        //   | - A dummy node simplifies handling edge cases.    |
        //   | - `prev` is positioned just before the reversal.  |
        //   | - Nodes are relocated one at a time to reverse    |
        //   |   their order within the specified segment.       |
        //   | - All `next` and `prev` pointers are correctly    |
        //   |   updated to maintain list integrity.             |
        //   | - The head pointer is reset at the end.           |
        //   +===================================================+
        
        if (head == null || startIndex >= endIndex) return;
        
        Node dummy = new Node(0);
        dummy.next = head;
        head.prev = dummy;
        
        Node pre = dummy;

        // go tho the startIndex ind
        for(int i=0; i<startIndex; i++){
            if (pre.next == null) {
                head.prev = null;
                return;
            }
             pre = pre.next;
        }
        
        Node curr = pre.next;
        
        if (curr == null) {                     
            head = dummy.next;
            head.prev = null;
            return;
        }
        
        for(int i=0; i < endIndex - startIndex; i++){
            Node toMove = curr.next;
            if (toMove == null) break;
            
            curr.next = toMove.next;
            if (toMove.next != null) {
                toMove.next.prev = curr;    
            }
            
            toMove.next = pre.next;
            pre.next.prev = toMove; 
            
            pre.next = toMove;
            
            toMove.prev = pre;
        }
        
        head = dummy.next;
        head.prev = null;
    }
```
## Swap Pairs
```java
public void swapPairs(){
        if (head == null || head.next == null) return;
        
        Node preHead = new Node(0);
        preHead.next = head;
        head.prev = preHead;
        
        Node curr = head;
        
        while (curr != null && curr.next != null) {
            Node first  = curr;         
            Node second = curr.next;
            
            Node before = first.prev;
            Node after  = second.next;
            
            // before -> second
            if (before != null) before.next = second;
            second.prev = before;
            
            // second -> first
            second.next = first;
            first.prev  = second;
            
            // first -> after
            first.next = after;
            if (after != null) after.prev = first;
            
            curr = after;
        }
        
        this.head = preHead.next;
        head.prev = null;
    }
```
## reverseString
```java
    public static String reverseString(String str){
        Stack<Integer> stack = new Stack<>();
        
        str.codePoints().forEach(stack::push);
        
        StringBuilder sb = new StringBuilder();
        while (!stack.isEmpty()) {
            sb.append((char)(int) stack.pop());
        }
        return sb.toString();
    }
```

## Sort Stack 
```java
    public static void sortStack(Stack<Integer> s) {

        Stack<Integer> newStack = new Stack<>();
        
        int temp;
        
        while(!s.isEmpty()){
            temp = s.pop();
            
            if(newStack.isEmpty() || newStack.peek() <= temp){
                newStack.push(temp);
            } else {
                while(!newStack.isEmpty() && newStack.peek() > temp){
                    s.push(newStack.pop());
                };
                newStack.push(temp);
            };
        }
        
        while(!newStack.isEmpty()){
           s.push(newStack.pop()); 
        }
    };
```

