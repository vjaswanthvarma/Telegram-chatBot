const TelegramBot=require("node-telegram-bot-api");
const token="6150829446:AAHwp5QDVEK-0nhET8Ygr7A720WoR9-NgN4";
const newBot=new TelegramBot(token,{polling:true});
const request = require('request');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore} = require('firebase-admin/firestore');

var serviceAccount = require("./key.json");

initializeApp({
  credential: cert(serviceAccount)
});
const db = getFirestore();
var dat;
var year,Releaseddate,director,actors,imdbrate,collection;
newBot.on("message",function(data){
    dat=data.text.split(" ");
    request("https://www.omdbapi.com/?t="+dat[1]+"&apikey=8a72b5b9",function(error,response,body){
    newBot.sendMessage(data.chat.id,"$When we Store or Retrive Data from the firebase we Must be use INSERT or GET Keywords before your movie name$");
    newBot.sendMessage(data.chat.id,"Lets welcome MovieUpdateBot");
    if(dat[0].toLowerCase()==="insert"){
       if(JSON.parse(body).Response==="True"){
            newBot.sendMessage(data.chat.id,"Title: "+JSON.parse(body).Title);
        if(JSON.parse(body).Year!=="N/A"){
            year=JSON.parse(body).Year;
            newBot.sendMessage(data.chat.id,"Year: "+JSON.parse(body).Year);
          }
        else{
            year="Not Available any Year Data";
            newBot.sendMessage(data.chat.id,"Year: Not Available any Year Data");
        }

        if(JSON.parse(body).Released!=="N/A"){
            Releaseddate=JSON.parse(body).Released;
            newBot.sendMessage(data.chat.id,"Released: "+JSON.parse(body).Released);
        }
        else{
            Releaseddate="Not Available any Released Date";
            newBot.sendMessage(data.chat.id,"Released: Not Available any Released Date");
        }
        if(JSON.parse(body).Director!=="N/A"){
            director=JSON.parse(body).Director;
            newBot.sendMessage(data.chat.id,"Director: "+JSON.parse(body).Director);
        }
        else{
            director="Not Available any Director Name";
            newBot.sendMessage(data.chat.id,"Director: Not Available any Director Name");
        }
        if(JSON.parse(body).Actors!=="N/A"){
            actors=JSON.parse(body).Actors;
            newBot.sendMessage(data.chat.id,"Actors: "+JSON.parse(body).Actors);
        }
        else{
            actors="Not Available any Actors Names";
            newBot.sendMessage(data.chat.id,"Actors: Not Available any Actors Names");
        }
        if(JSON.parse(body).imdbRating!=="N/A"){
            imdbrate=JSON.parse(body).imdbRating;
            newBot.sendMessage(data.chat.id,"IMDB Rating: "+JSON.parse(body).imdbRating);
        }
        else{
            imdbrate="Not Available any Rating Data";
            newBot.sendMessage(data.chat.id,"IMDB Rating: Not Available any Rating Data");
        }
        if(JSON.parse(body).BoxOffice!=="N/A"){
            collection=JSON.parse(body).BoxOffice;
            newBot.sendMessage(data.chat.id,"Box Office Collections: "+JSON.parse(body).BoxOffice);
        }
        else{
            collection="Not Available any Collections Data";
            newBot.sendMessage(data.chat.id,"Box Office Collections: Not Available any Collections Data");
        }
         db.collection("MovieDetailsDataBase").add({
            Title:"Title: "+JSON.parse(body).Title,
            ReleaseDate:"ReleaseDate: "+Releaseddate,
            Actors:"Actors: "+actors,
            Director:"Director:"+director,
            IMDBRating:"IMDBRating: "+imdbrate,
            BoxOffice:"BoxOffice: "+collection,
            chatId:"ChatId: "+data.chat.id,
         }).then(function(){
            newBot.sendMessage(data.chat.id,"$Movie details is stored Successfully$");
         })
        }
    }
    else if(dat[0].toLowerCase()==='insert'){
        if(JSON.parse(body).Response==='False'){
        newBot.sendMessage(data.chat.id,"Movie is not found,please enter another movie name");
        }
    }
    else if(dat[0].toLowerCase()==="get"){
        db.collection("MovieDetailsDataBase").where("Title","==","Title: "+JSON.parse(body).Title).get().then(function(docs){
        docs.forEach(function(doc){
newBot.sendMessage(data.chat.id,doc.data().Title+" \n"+doc.data().ReleaseDate+" \n"+doc.data().Actors+" \n"+doc.data().Director+" \n"+doc.data().IMDBRating+"\n"+doc.data().chatId+"\n"+doc.data().BoxOffice);
            })
        })
    }
    else if(dat[0].toLowerCase()==="thankyou"){
        newBot.sendMessage(data.chat.id,"Thanks for Visting the MovieUpdateBot");
    }
    else if((dat[0]!=='insert')&&(dat[0]!=='get')){
        newBot.sendMessage(data.chat.id,"$Please we must be use either GET or INSERT keywords$");
    }
})
})
