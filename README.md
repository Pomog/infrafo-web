# infrafo-web
Meet me online: video &amp; chat built with Next.js
based on: https://redux.js.org/usage/nextjs
```
npx create-next-app@latest infrafo-web --ts --tailwind --app --src-dir --eslint --import-alias "@/*"

npm i @reduxjs/toolkit react-redux

npm i -D prettier
```

## Reverse Between
```java
    public void reverseBetween(int m, int n) {
        if (this.head == null || m >= n) return;
        
        Node helperNode = new Node(0);
        helperNode.next = this.head;
        
        Node preRunner = helperNode;
        
        for (int i = 1; i < m && preRunner.next != null; i++) {
            preRunner = preRunner.next;
        }
        
        if (preRunner.next == null) return;
        
        Node runner = preRunner.next;

// TODO
        
        this.head = helperNode.next;
            
        };
```

