
var noNodes ;
var noConn ;

var noNodesSel=0;
var nodesSel=[];

var gravityConstant = 0.5;
var forceConstant = 9000;
var physics = true;

var nodes = [];
var nodeCon ;
var buttons=[];


var startDisMultiplier = 0.5;



let xs=[65, -27, -247, -211, -283];
let ys=[289, 294, 176, 202, 110];

let graphHasConverged = false;
let threshold = 0.01; 
let vConverged=false

var buttonStart,myDiv,buttonReset,canvas;

var testF;
var costMatrix;
var numRows;
var numCols;
const MIN = -1;

var  d=[], s=[], p=[];

let start = false;





let m;

let img;
let angle
let pArr=[[]],ii=1;
let st=[],f=[]
let x1,y1
let car;
let x2,y2
let resizedWidth = 50; 
let resizedHeight = 30;


function preload() {
  img = loadImage('van.png');
}


function setup() {
  canvas = createCanvas(600, 600);
  canvas.mouseClicked(handleClick);
  background(255);
  fill(0);
  angleMode(DEGREES);

  ReadFile(function(testF, numNodes, numVertices) {
    noNodes = numNodes;
    noConn = numVertices;

    for (let i = 0; i < noNodes; i++) {
      let x = xs[i];
      let y = ys[i];
      node = new Node(createVector(x, y), 3, i);
      nodes.push(node);
    }
    car = createDiv();
  
  car.class('carDiv');
  car.position(0, 0);
  car.size(resizedWidth, resizedHeight);
  img.resize(resizedWidth, resizedHeight);
  car.style('background-image', 'url(' + img.canvas.toDataURL() + ')');

    if (testF) {
      nodeCon = testF;
      numRows = numNodes;
      numCols = numNodes;
      vConverged=converging();
      translate(width / 2, height / 2);
        if (vConverged) {
        drawGraph(); // This line was missing
        nodeCon.forEach(con => {
          stroke(0);
        });
      }

      buttonStart = createButton('Start');
      buttonStart.class('button');
      buttonStart.id('start');
      buttonStart.mouseClicked(handleClick);
      buttonStart.position(1, 579);

      buttonReset = createButton('Reset');
      buttonReset.class('button');
      buttonReset.id('reset');
      buttonReset.mouseClicked(handleClick);
      buttonReset.position(40, 579);

      myDiv = createDiv("NU AI SELECTAT DOUA NODURI!!!");
      myDiv.class('undisplayed');
      myDiv.position(170, 300);
    } else {
      console.error('An error occurred while reading the file.');
    }
    
  });

  
  
}



function draw(){
  translate(width/2,height/2)
  if(start){
    // console.log(m,angle)
    // console.log(st,f)
    // console.log(st,f)

    if(((st[0]<f[0]&&x1>f[0])||(st[0]>f[0]&&x1<f[0]))&&pArr.indexOf(f)<pArr.length-1){  
      st=f
      f=pArr[pArr.indexOf(f)+1]
      x1=st[0]
      y1=st[1]
      m = getM(st[0],st[1],f[0],f[1]);
      
      angle = atan(m);
      // console.log(m,angle)
      if(pArr.indexOf(f)>pArr.length-1)
        start=false
    } 
    if(st[0]!==f[0]){
       y1=getEquation(m, x1, f[0], f[1])
      if(st[0]<f[0]){
        //translate(x1,y1);
        Car(x1,y1,angle);
        if(x1<=f[0])
        x1++
      }
      else
        if(st[0]>f[0]){
          // translate(x1,y1);
          Car(x1,y1,180+angle);
          console.log(x1)
          if(x1>=f[0])
          x1--     
        }
    }
    else{
       
      if(st[1]<f[1]){
        
        
        Car(x1,y1,angle);
        if(y1<=f[1])
        y1++
      }
      else
        if(st[1]>f[1]){
          
          
          
         Car(x1,y1,180+angle);
          if(y1>=f[1])
          y1--
        }
        
      }
  
  }
}


function Car(x,y,a){
  car.remove();
  car = createDiv();
  car.style('transform', `rotate(${a}deg)`);
  car.class('carDiv');
  car.position(x+width/2-resizedWidth/2, y+height/2-resizedHeight/2);
  car.size(resizedWidth, resizedHeight);
  img.resize(resizedWidth, resizedHeight);
  car.style('background-image', 'url(' + img.canvas.toDataURL() + ')');
  car.show();
}

function getM(x1, y1, x2, y2) {
  
  if(y2-y1===0||x2-x1===0)
    return 0;
  else
    return (y2 - y1) / (x2 - x1) ;
}

function getEquation(m, x, x1, y1) {
  let y = m * (x - x1) + y1;
  return y;
}









function converging(){
  while (!graphHasConverged) {
      //   nodeCon.forEach(con => {
      //   node1 = nodes[con[0]];
      //   node2 = nodes[con[1]];
      //   line(node1.pos.x, node1.pos.y,
      //     node2.pos.x, node2.pos.y);
      // });
    applyForces(nodes)
    nodes.forEach(node => {
      
      if (physics) {
        node.update()
      }
    })     
    graphHasConverged = checkConvergence(nodes, threshold);
  }
    return true;
  
}


function checkConvergence(nodes, threshold) {
  
  let maxDisplacement = 0;
  for (let i = 0; i < nodes.length; i++) {
    let node = nodes[i];
   // console.log(node.prevPos);
    // console.log(node.pos.dist(node.prevPos));
    let displacement = node.pos.dist(node.prevPos);
    if (displacement > maxDisplacement) {
      maxDisplacement = displacement;
    }
    //node.prevPos = node.pos.copy();
  }
  return maxDisplacement < threshold;
}


function handleClick(event) {

  let element = event.target;
  let classList = element.classList;
  if(element.id==='defaultCanvas0'&&  myDiv.elt.classList.contains('displayed')){
    myDiv.class('undisplayed')
  }
  
  if(element.id>=1&&element.id<=10){
  if(classList.contains('unclicked')||classList.contains('clicked')){
  
  if (classList.contains('unclicked')) {
   
    if(noNodesSel<2){
      classList.remove('unclicked');
      classList.add('clicked')
      nodesSel.push(element)
      noNodesSel++;
    }
  }
  else{
    classList.remove('clicked');
    classList.add('unclicked')   
    nodesSel.splice(nodesSel.indexOf(element),1)
    noNodesSel--;
  }
  }
  }
  
  else{
    if(element.id=='start'){
      if(noNodesSel===2)
        {
          start = true;
         
          costMatrix = createMatrix(numRows, numCols, MIN);
          generare_drum(nodesSel[0].id-1);
          afisare(nodesSel[1].id-1);

        }
    
    else{
          myDiv.class('displayed')
  setTimeout(() => {    myDiv.class('undisplayed');}, 5000);
    }
     
      }
     
      else{
        if(element.id=='reset'&&noNodesSel===2){
          
           drum(nodesSel[1].id-1,"red")
          
          nodesSel.forEach(node=>{
            node.classList.remove('clicked')
            node.classList.add('unclicked')
          
          })
                   
            nodesSel.splice(0,2)
          noNodesSel=0
      }
    }
  }
}





function drawGraph() {
  nodeCon.forEach(con => {
    let node1 = nodes[con[0]];
    let node2 = nodes[con[1]];
    line(node1.pos.x, node1.pos.y, node2.pos.x, node2.pos.y);
  });

  nodes.forEach(node => {
    fill(0);
    node.draw();

    nodeCon.forEach(con => {
      if (con[0] === node.no) {
        let targetNode = nodes[con[1]];
        let dir = p5.Vector.sub(targetNode.pos, node.pos);
        let arrowSize = 10; // Size of the arrowhead
        let arrowPos = p5.Vector.add(node.pos, dir.mult(0.5));
        drawArrow(arrowPos, dir, arrowSize);
      }
    });
  });
}


function drawArrow(base, vec, arrowSize) {
  push();
  translate(base.x, base.y);
  rotate(vec.heading());
  noStroke(); // Remove the line stroke
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  pop();
}


function applyForces(nodes) {

  // apply force towards centre
  nodes.forEach(node => {
    gravity = node.pos.copy().mult(-1).mult(gravityConstant)
    node.force = gravity
    node.prevPos=node.pos.copy();
  })

  // apply repulsive force between nodes
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      pos = nodes[i].pos
      dir = nodes[j].pos.copy().sub(pos)
      const magSquared = dir.magSq(); // Calculate the magnitude squared
if (magSquared > 0) {
  force = dir.div(magSquared); // Divide by the magnitude squared
} else {
  // Handle the case where dir has zero magnitude (optional)
  // You can choose to skip this force calculation or handle it differently
}

      force.mult(forceConstant)
      nodes[i].force.add(force.copy().mult(-1))
      nodes[j].force.add(force)
    }
  }

  // apply forces applied by connections
  nodeCon.forEach(con => {
    let node1 = nodes[con[0]]
    let node2 = nodes[con[1]]
    let maxDis = con[2]
    let dis = node1.pos.copy().sub(node2.pos)
    diff = dis.mag() - maxDis
    node1.force.sub(dis)
    node2.force.add(dis)
  })
}


function ReadFile(callback) {
  const filename = 'input.txt'; // Specify your file name here

  fetch(filename)
    .then(response => response.text())
    .then(fileContents => {
      const lines = fileContents.split('\n'); // Split contents into lines
      
      // Extract number of nodes and vertices from the first line
      const [numNodes, numVertices] = lines[0].trim().split(' ').map(value => parseInt(value));

      // Extract vertex data and create the vertices array
      const vertices = lines.slice(1).map(line => line.trim().split(' ').map(value => parseFloat(value)));
      
      callback(vertices, numNodes, numVertices); // Pass vertices, numNodes, and numVertices to the callback
    })
    .catch(error => {
      console.error('An error occurred:', error);
      callback(null); // Pass null to the callback
    });
}


function createMatrix(numRows, numCols, MIN) {
  let matrix = [];

  for (let i = 0; i < numRows; i++) {
    matrix.push([]);
    for (let j = 0; j < numCols; j++) {
      matrix[i].push(MIN);
    }
  }
  nodeCon.forEach(node=>{

    matrix[node[0]][node[1]]=node[2];
  })
  
  p = Array(noNodes).fill(-1);
  s = Array(noNodes).fill(-1);
// console.log(matrix)
  return matrix;
}


function generare_drum(x) {
    let i, j, max, y; s[x] = 1;
    for (i = 0; i <noNodes; i++) {
        d[i] = costMatrix[x][i]
        if (i !== x && d[i] !== MIN) 
            p[i] = x
      // console.log(d[i])
    }  
    for (i = 0; i <noNodes - 1; i++) {
        for (j = 0, max = MIN; j <noNodes; j++)
            if (s[j] === -1 && d[j] > max) {
              // console.log(i,j,d[j])
                max = d[j]; y = j;
            }
        s[y] = 1;
        for (j = 0; j <noNodes; j++){

            if (s[j] === -1 && d[j] < d[y] + costMatrix[y][j]&&costMatrix[y][j]!==-1&&costMatrix[x][j]===-1) {

                d[j] = d[y] + costMatrix[y][j]; p[j] = y;
            }
    }
  }
  
   
}


function drum(i,colorr) {
  if (p[i] !== -1) {
    stroke(colorr)
    drum(p[i],colorr); 
    console.log(i,ii)
    //line(nodes[i].pos.x,nodes[i].pos.y,nodes[p[i]].pos.x,nodes[p[i]].pos.y)
    pArr[ii]=[]
    pArr[ii][0]=nodes[i].pos.x
    pArr[ii][1]=nodes[i].pos.y
    ii++; 
  }

  
}


function afisare(i){
 if(d[i]===-1){
   console.log("nu exista drum de la", nodesSel[0].id,"la nodul", i+1)
    nodesSel.forEach(node=>{
            node.classList.remove('clicked')
            node.classList.add('unclicked')
          
          })
                   
            nodesSel.splice(0,2)
          noNodesSel=0           
  }
  else{
              console.log("drumul cu costul maxim de la nodul ",nodesSel[0].id," la nodul ", i+1, "are costul",d[i],'\n')
    
                drum(i,"red");
                pArr[0][0]=nodes[nodesSel[0].id-1].pos.x
                pArr[0][1]=nodes[nodesSel[0].id-1].pos.y
                st=pArr[0]
                x1=st[0]
                y1=st[1]
                f=pArr[1]
                x2=f[0]
                y2=f[1]
                m = getM(st[0],st[1],f[0],f[1]);
                angle = atan(m);
                console.log(x1,y1);
  }
  
  
            
}











function Node(pos, size,no) {
  this.pos = pos
  this.force = createVector(0, 0)
  this.mass = (2 * PI * size)
  //this.fs = []
  this.prevPos=pos;
  this.no=no;
  
  
}

Node.prototype.update = function() {
  force = this.force.copy()
  vel = force.copy().div(this.mass)
  // print("VEL", vel, "FORCE", force)
  this.pos.add(vel)
}

Node.prototype.draw = function() {
  //console.log(node.no)
  button = createButton(`${this.no+1}`);
 
  button.class('unclicked')
  button.id(`${this.no+1}`)
  button.mouseClicked(handleClick)
  button.position(this.pos.x-this.mass/4+width/2, this.pos.y-this.mass/4+height/2);
  
  buttons.push(button);
  //console.log(this.pos.x, this.pos.y)
  //ellipse(this.pos.x, this.pos.y, this.mass, this.mass)
}




