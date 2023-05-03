class Node {
	constructor(data) {
		this.data = data;
		this.left = null;
		this.right = null;
	}
}

class Tree {
	constructor(arr) {
		//Sort array and remove duplicates
		arr = [...new Set(arr.sort((a, b) => a - b))];
		this.root = buildTree(arr);
	}
	
	insert(value, tree = this.root) {
		//Base Case
		if (tree === null) {
			tree = new Node(value);
			return tree;
		}
		//Recursive Case
		else {
			if (tree.data === value) return tree;
			if (value > tree.data) tree.right = this.insert(value, tree.right);
			else tree.left = this.insert(value, tree.left);
			return tree;
		}
	}
	
	find(value, tree = this.root) {
		if (tree.data === null) return false;
		if (tree.data === value) return tree;
	
		if (value > tree.data) return find(value, tree.right);
		else return find(value, tree.left);
	}
	
	findParent(node, tree = this.root) {
		if (tree === null) return false;
		if (tree.left === node || tree.right === node) return tree;
	
		if (node.data > tree.data) return this.findParent(tree.right, node);
		else return this.findParent(tree.left, node);
	};
	
	remove(value, tree = this.root) {
		let node = find(tree, value);
		if (!node) return;
	
		//If leaf node, set to null to remove
		if (node.left === null && node.right === null) {
			const parentNode = this.findParent(tree, node);
			if (parentNode.right.data === node.data) parentNode.right = null;
			else parentNode.left = null;
		}
	
		//If only right children parent points to node right
		if (node.left === null) {
			const parentNode = this.findParent(tree, node);
			return (parentNode.right = node.right);
		}
	
		//If children on both sides - next is the next biggest element (1 right then smallest left)
		const parentNode = this.findParent(tree, node);
		const originalLeft = node.left;
		let leftPointer = node.right;
		while (leftPointer.left !== null) {
			leftPointer = leftPointer.left;
		}
		const nextNode = leftPointer;
	
		//Delete node
		if (node.data > parentNode.data) parentNode.right = nextNode;
		else parentNode.left = nextNode;
	
		//Put everything back in place
		nextNode.left = originalLeft;
	}
	
	levelOrder(fn, root = this.root) {
		const q = [root];
		const traversed = [];
		while (q.length > 0) {
			const node = q.shift();
			if (fn) fn(node);
			if (node.left) q.push(node.left);
			if (node.right) q.push(node.right)
			traversed.push(node.data);
		}
		return traversed;
	}
	
	preOrder(fn, root = this.root) {
		if (root === null) return [];
		if (fn) fn(root);
		return [root.data, ...this.preOrder(fn, root.left), ...this.preOrder(fn, root.right)];
	}
	
	inOrder(fn, root = this.root) {
		if (root === null) return [];
		if (fn) fn(root);
		return [...this.inOrder(fn, root.left), root.data, ...this.inOrder(fn, root.right)];
	}
	
	postOrder(fn, root = this.root) {
		if (root === null) return [];
		if (fn) fn(root);
		return [...this.postOrder(fn, root.left), ...this.postOrder(fn, root.right), root.data];
	}
	
	height(root = this.root) {
		if (root === null) return -1;
		
		const leftDepth = this.height(root.left);
		const rightDepth = this.height(root.right);
	
		if (rightDepth > leftDepth) return rightDepth + 1;
		else return rightDepth + 1;
	}
	
	depth(node, root = this.root, n=0) {
		if (root === null) return false;
		if (root.data === node.data) return n;
		if (node.data > root.data) {
			return this.depth(root.right, node, n+1);
		}
		else {
			return this.depth(root.left, node, n+1);
		}
	}
	
	isBalanced(tree = this.root) {
		if (tree === null) return null;
		const leftHeight = this.height(tree.left);
		const rightHeight = this.height(tree.right);

		if (leftHeight - rightHeight === 1 || rightHeight - leftHeight === 1 || leftHeight === rightHeight) {
			return true;
		}
	
		return false;
	}
	
	reBalance(tree = this) {
		const arr = this.inOrder();
		return tree.root = buildTree(arr);

	}

	prettyPrint(node = this.root, prefix = "", isLeft = true) {
		if (node === null) {
			return;
		}
		if (node.right !== null) {
			this.prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
		}
		console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
		if (node.left !== null) {
			this.prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
		}
	}

}

const mathFuncs = (() => {
	function createRandomArray () {
		const arrsize = getRndInteger(3, 15);
		const arr = [];
	
		for (let i = 0; i < arrsize; i++) {
			let num = getRndInteger(1, 20)
			while (arr.includes(num)) {
				num = getRndInteger(1, 20);
			}
			arr.push(num);
		}
		return arr;
	}
	
	function getRndInteger(min, max) {
		return Math.floor(Math.random() * (max - min + 1) ) + min;
	}

	return {
		createRandomArray,
		getRndInteger
	}
})();

function buildTree(arr, start = 0, end = arr.length - 1) {
	//Base Case
	if (start > end) return null;

	//Recursive case
	const mid = Math.floor((start + end) / 2);
	const root = new Node(arr[mid]);

	//Assign node's left and right children
	root.left = buildTree(arr, start, mid - 1);
	root.right = buildTree(arr, mid + 1, end);

	return root;
}


//Driver Script testing program

const driverScript = (() => {
	//Generate array of random numbers
	const arr = mathFuncs.createRandomArray();
	
	//Build Tree
	let tree = new Tree(arr);

	//Confirm tree is balanced
	console.log(`Tree is balanced = ${tree.isBalanced()}`);

	//Traverse items
	console.log(`Level Order: ${tree.levelOrder()}`)
	console.log(`PreOrder: ${tree.preOrder()}`)
	console.log(`InOrder: ${tree.inOrder()}`)
	console.log(`PostOrder: ${tree.postOrder()}`)

	//Add 5 random numbers above 100
	for (let i = 0; i < 5; i++) {
		tree.insert(mathFuncs.getRndInteger(100, 200))
	}

	//Confirm tree is now unbalanced
	console.log(`Tree is unbalanced = ${tree.isBalanced()}`);

	//Rebalance tree
	console.log("Rebalancing");
	tree.reBalance();

	//Confirm tree is rebalanced
	console.log(`Tree is rebalanced = ${tree.isBalanced()}`);

	//Traverse items again
	console.log(`Level Order: ${tree.levelOrder()}`)
	console.log(`PreOrder: ${tree.preOrder()}`)
	console.log(`InOrder: ${tree.inOrder()}`)
	console.log(`PostOrder: ${tree.postOrder()}`)
	console.log("Pretty Print: \n")
	tree.prettyPrint();
})();


