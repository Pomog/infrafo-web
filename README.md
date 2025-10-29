# infrafo-web
Meet me online: video &amp; chat built with Next.js
based on: https://redux.js.org/usage/nextjs
```
npx create-next-app@latest infrafo-web --ts --tailwind --app --src-dir --eslint --import-alias "@/*"

npm i @reduxjs/toolkit react-redux

npm i -D prettier
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

