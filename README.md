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
```java
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

