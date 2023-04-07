//Init elevator properties
class elevator {
  constructor(names, min_floor, max_floor) {
    this.names = names;
    this.current_floors = [];
    this.destination_floor = '';
    this.min_floor = min_floor;
    this.max_floor =  max_floor;
    this.states = [];
    this.position = [];
  }
  floor_names(i){
    if (i==0) {
      return 'Ground Floor';
    } else {
      return 'Floor '.concat(i);
    }
  }
  panel_buttons(i){
    if (i==0) {
      return 'G';
    } else {
      return i;
    }
  }
  get_status(i){
    return this.states[i];
  }

  move_position(destination){
    var step_element=destination.split("_");
    var destination_floor=Number(step_element[1]);
    if (isNaN(step_element[0])) {
      var elevator_name=step_element[0];
    } else {
      //check if both elevators are on the same floor OR check which elevator is closer OR if the distance is the same then pick the one from the lower floor
      if ((this.position['A'] == this.position['B']) || (Math.abs(this.position['A']-destination_floor) < (Math.abs(this.position['B']-destination_floor))) || ((Math.abs(this.position['A']-destination_floor) == (Math.abs(this.position['B']-destination_floor))) && (this.position['A'] < this.position['B']))){
        var elevator_name='A';
      } else {
        var elevator_name='B';
      }
    }
    if (this.get_status(elevator_name) == 'busy'){
      alert('Elevator in movement');
      return;
    }
    
 
    var current_position=this.position[elevator_name];

    if (current_position != destination_floor) {
      this.states[elevator_name]='busy';
    }
      
    //loop to reach each floor
    function in_move(direction) { 
      setTimeout(function() {
        if (direction=='up'){
          var next_floor=current_position+1;
        } else {
          var next_floor=current_position-1;
        }
        elevator_properties.update_color(elevator_name, next_floor, 'busy', direction); 
        current_position=next_floor;
        
        if ((direction=='up') && (current_position < destination_floor)) {
          in_move('up');
        }          
        if ((direction=='down') && (current_position > destination_floor)) {
          in_move('down');
        }
        if (current_position == destination_floor) {
          elevator_properties.update_color(elevator_name, destination_floor, 'ready', '');
        }
      }, 1000)
    }
    //inital loop start
    if (current_position < destination_floor) {
      in_move('up');
    }          
    if (current_position > destination_floor) {
      in_move('down');             
    }
   
  }

  update_color(elevator, position, status, direction){
    //select new floor
    var arrow=''
    if (direction=='up'){
      arrow='↑';
    } else if (direction=='down'){
      arrow='↓';
    }
    document.getElementById(elevator +'_'+ position).style.backgroundColor ='yellow';
    document.getElementById(elevator +'_'+ position).innerHTML = elevator;
    document.getElementById('display_' + elevator).value = this.panel_buttons(position) + ' '+ arrow;
    
    for (let i = this.max_floor; i >= this.min_floor; i--) {
      if (elevator=='A'){
      document.getElementById('display_' + elevator + '_' + i).value = arrow + ' ' + this.panel_buttons(position);    
      } else {
      document.getElementById('display_' + elevator + '_' + i).value = this.panel_buttons(position) + ' ' + arrow;    
      }
      
    }
    //restore previous floor
    if ((typeof this.position[elevator] === 'number') && (this.position[elevator] !=position)) {
      document.getElementById(elevator +'_'+ this.position[elevator]).style.backgroundColor ='white';
      document.getElementById(elevator +'_'+ this.position[elevator]).innerHTML = '';  
    }
    this.position[elevator]=position;
    this.states[elevator]=status;
  }

}    

//draw left side
function draw_system() {
  const body = document.body, 
  tbl = document.createElement('table');
//  tbl.style.width = '250px';
  tbl.style.marginTop = '0px';
  tbl.style.position = 'absolute';
  tbl.style.marginLeft = '0px';
  tbl.style.textAlign ='center';
  for (let i = max_floor; i >= min_floor; i--) {
    const tr = tbl.insertRow();
    for (let j = 0; j < design_column; j++) {
      const td = tr.insertCell();
      if (j == 0){
        td.appendChild(document.createTextNode(elevator_properties.floor_names(i)));
      }
      if (j == 1) {
        td.style.border = '1px solid black';
        td.style.width ='40px';
        td.style.height ='80px';    
        td.id='A_'.concat(i);
      }
      if (j==2){
        td.style.width ='100px';
        td.innerHTML=`<input type="text" style="text-align: right; background-color: white; font-weight:bold; border: 0;" id="display_A_${i}" size="1" disabled><input type = "button" onclick = "elevator_properties.move_position('_${i}')" value = "­-"><input type="text" style="text-align: left; background-color: white; font-weight:bold; border: 0;" id="display_B_${i}" size="1" disabled>`; 
      }
      if (j == 3) {          
        td.style.border = '1px solid black';
        td.style.width ='40px';
        td.style.height ='80px';          
        td.id='B_'.concat(i);
      }
    }
  }
  body.appendChild(tbl);
}

//draw right side
function draw_panels(panels) {
var position_push = 30;

  for (let k = panels.length-1; k >= Object.keys(panels)[0]; k--) {
    var panel_name = panels.at(k); 
    const body = document.body,
      panel = document.createElement('table');
      panel.style.marginTop = '0px';
      panel.style.position = 'fixed';
      panel.style.right = position_push+'px';
      panel.style.marginRight = '0px';
      panel.style.width = '70px';
      panel.style.border = '1px solid black';
      panel.style.backgroundColor="gray";
      header = panel.createTHead();
      row = header.insertRow(0);    
      cell = row.insertCell(0);
      cell.style.textAlign ='center';
      cell.innerHTML=`Panel ${panel_name}<br><input type="text" style="text-align: center; background-color: white;font-weight:bold;" id="display_${panel_name}" size="2" disabled>`;
    for (let i = max_floor; i >= min_floor; i--) {
      const tr = panel.insertRow();
      const td = tr.insertCell();
      td.innerHTML=`<input type = "button" onclick = "elevator_properties.move_position('${panel_name+'_'+i}')" value = "${elevator_properties.panel_buttons(i)}">`; 
      td.style.border = '3px solid black';
      td.style.width = '1px';
      td.style.textAlign ='center';
      td.style.overflow = 'hidden';
      body.appendChild(panel);
    }
    //fix panel overlap
    position_push=position_push+90;
  }
}

const elevator_names=['A','B'];
let design_column =4;
const max_floor = 6;
const min_floor=0;

let elevator_properties = new elevator(elevator_names, min_floor, max_floor);

draw_panels(elevator_names);
draw_system();
elevator_properties.update_color('A',0,'ready')
elevator_properties.update_color('B',6,'ready');
elevator_properties.get_status('A');
