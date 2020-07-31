
// Sets up letters string and selects elements in document
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const textBox = document.querySelector('.textBox');
const messageBox = document.querySelector('.cryptic');
const rotor1option = document.querySelector(".rotor1_options");
const rotor2option = document.querySelector(".rotor2_options");
const rotor3option = document.querySelector(".rotor3_options");
const rotor1position = document.querySelector(".rotor1_position");
const rotor2position = document.querySelector(".rotor2_position");
const rotor3position = document.querySelector(".rotor3_position");
const reflectorPosition = document.querySelector(".reflector_options")
const submitBtn = document.querySelector(".submit-btn");
const randBtn = document.querySelector(".random-btn");


// Sets rotor and reflector configuration according to Enigma rotors introduced between 1938 and 1939
let rotors = [
    'ESOVPZJAYQUIRHXLNFTGKDCMWB',
    'VZBRGITYUPSDNHLXAWMJQOFECK',
    'JPGVOUMFYQBENHZRDKASXLICTW',
    'NZJHGRCXMYSWBOUFAIVLPEKQDT',
    'FKQHTLXOCBJSPDZRAMEWNIUYGV'
]

let reflectors = [
   'EJMZALYXVBWFCRQUONTSPIKHGD',
   'YRUHQSLDPXNGOKMIEBFZCWVJAT',
   'FVPJIAOYEDRZXWGCTKUQSBNMHL'
]


// Function that rolls index over if it passes 25
let roll = function(index) {
    if (index > 25) {
        return Math.abs(26-index);
    } else if (index < 0) {
        return index + 26;
    } else return index;
}

// Transforms rotors and reflectors to number arrays that determine the index change, creates a reverse of each rotor for the trip back
let rotorsGo = [[],[],[],[],[]];
for (let i in rotors) {
    for (let j in rotors[i]) {
        rotorsGo[i].push(roll(LETTERS.indexOf(rotors[i][j])-j))
    }
}

let rotorsCome = [[],[],[],[],[]];
for (let i in rotors) {
    for (let j in rotors[i]) {
        rotorsCome[i][LETTERS.indexOf(rotors[i][j])] = roll(j-LETTERS.indexOf(rotors[i][j]))
    }
}

let reflectorsArr = [[],[],[]]
for (let i in reflectors) {
    for (let j in reflectors[i]) {
        reflectorsArr[i].push(roll(LETTERS.indexOf(reflectors[i][j])-j));
    }
}


// Sets inputted settings into the enigma
let configure = function() {
  console.log('huh')
}


// randomize function to pick random rotors and positions
let randomize = function() {

  // Function that gets a random integer less than the inputted value
  let randInt = (n) => Math.floor(Math.random() * n);

  // Selects random rotors out of the 5
  let [R1, R2, R3]  = randOf5();
  function randOf5() {
      let N = [];
      while (N.length < 3) {
          let n = Math.floor(Math.random() * 5);
          N.indexOf(n) < 0 ? N.push(n) : 0;
      }
      rotor1option.value = "rotor" + (N[0]+1);
      rotor2option.value = "rotor" + (N[1]+1);
      rotor3option.value = "rotor" + (N[2]+1);
      return [rotors[N[0]],rotors[N[1]],rotors[N[2]]]
  };
  let refN = randInt(3) + 1;
  let REF = reflectors[refN];
  reflectorPosition.value = "reflector" + (refN);

  // Sets random starting point for rotors
  let randRotors = function() {
    let rotor1 = randInt(26) + 1;
    let rotor2 = randInt(26) + 1;
    let rotor3 = randInt(26) + 1;
    rotor1position.value = "r1_" + rotor1;
    rotor2position.value = "r2_" + rotor2;
    rotor3position.value = "r3_" + rotor3;
    return [rotor1, rotor2, rotor3];
  }
  let [rotor1, rotor2, rotor3] = randRotors();
  return [R1, R2, R3, REF, rotor1, rotor2, rotor3];
}
let [R1, R2, R3, REF, rotor1, rotor2, rotor3] = randomize();




// Function that moves rotors
let rotor = function() {
    if (rotor1 == 25) {
        rotor1 = 0;
        if (rotor2 == 25) {
            rotor2 = 0;
            if (rotor3 == 25) {
                rotor3 = 0;
            } else {
                rotor3++;
            }
        } else {
            rotor2++;
        }
    } else {
        rotor1++;
    }
}


// Function that takes input key and outputs key encrypted by rotors
let cryp = function(c) {
  c = roll(c + rotorsGo[0][roll(c + rotor1)]);         // through rotor 1
  c = roll(c + rotorsGo[1][roll(c + rotor2)]);         // through rotor 2
  c = roll(c + rotorsGo[2][roll(c + rotor3)]);         // through rotor 3
  c = roll(c + reflectorsArr[0][c]);                   // reflector
  c = roll(c + rotorsCome[2][roll(c + rotor3)]);       // back through rotor 3
  c = roll(c + rotorsCome[1][roll(c + rotor2)]);       // back through rotor 2
  c = roll(c + rotorsCome[0][roll(c + rotor1)]);       // back through rotor 1
  return c; 
}
console.log(cryp(0));


// Code executed on key down
textBox.addEventListener('keydown', (event) => {
    if (event.keyCode > 64 && event.keyCode < 91) {
        let n = event.keyCode - 65;



        // Makes the letter light turn ON when the key goes down
        let selected = LETTERS[cryp(n)];
        console.log
        document.querySelector("." + selected).classList.add('pressed');
    }
});


// Code executed on key up
textBox.addEventListener('keyup', (event) => {
    if (event.keyCode > 64 && event.keyCode < 91) {
        let n = event.keyCode - 65;
        
        

        // Makes the letter light turn OFF when the key goes down
        let selected = LETTERS[cryp(n)];
        document.querySelector("." + selected).classList.remove('pressed');
        // Moves rotors
        rotor();
    }
});



// Listeners
submitBtn.addEventListener("click", configure());
randBtn.addEventListener("click", randomize());
