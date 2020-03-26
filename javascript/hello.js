// alert("Hello world");

// let message = "Hello world";
// alert(message);
// message = "Hallo Welt";
// alert (message);

const LINK_COLOR = "#ff0000";
console.log("link bitte in der Farbe ", LINK_COLOR);

let highscore = 520233;
console.log(highscore / 10);

let firstname = "John";
let lastname = "Smith";
console.log("Name: ", firstname, lastname)

let fullname = ('Jeffrey "The Dude" Lebowski');
console.log(fullname);

let template = 'Dein Highscore sind $ {highscore} Punkte';
console.log(template);

let isOver18 = true;
console.log(isOver18);

let age = 17;
console.log("über 18?", age > 18);

let participants = ["John", "Jane", "Max"];
console.log(participants);
console.log("Einträge im array:", participants.length);
console.log(participants[1]);

let gameHighscores = [2099, 1009, 2367];
console.log(gameHighscores);

let user = {
    firstname: "John",
    lastname:"Smith",
    age: 25
};
//das ist ein Objekt mit mehreren Eigenschaften

console.log(user);
console.log(user.firstname);
user.highscore = 200;
console.log(user);
//highscore zum object user dazuschreiben
user["highscore ever"] = 400;
console.log(user);

let a = 2;
let b = 4;
console.log(a+b);
console.log(b/(a-1));
a++;
// integer um einen Wert erhöhen
console.log(a);

let myAge = prompt("Wie alt bist du?");
console.log('Du bist ${myAge} Jahre alt');
console.log('über 18? ${myAge > 18}');

// if (myAge > 18){
//     console.log("Glückwunsch über 18");
// } else {
//     console.log("leider unter 18");
// }

