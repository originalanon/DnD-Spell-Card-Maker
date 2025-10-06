const spellsData = require('./card.json');
const settings = require('./settings.json');
const fs = require('fs');
const templatePath = './template.html';

let templateContent = fs.readFileSync(templatePath, 'utf-8');

function optimizeDescription(description){
    


}

for(var i = 0; i < spellsData.cards.length; i++){
    var currentCard = spellsData.cards[i]

    //Switch statement to get the correct endings for 1st, 2nd, 3rd, and Cantrip level spells
    var levelText = "";

    switch(currentCard.level){
        case 0:
            levelText = "Cantrip"
            break;
        case 1:
            levelText = "1st"
            break;
        case 2:
            levelText = "2nd"
            break;
        case 3:
            levelText = "3rd"
            break;
        default:
            levelText = currentCard.level.toString() + "th"
            break;
    }
    
    //TODO: Sanitize input on the GUI to make sure school name is capitlized
    if(currentCard.level == 0){
        templateContent = templateContent.replace("${level-school}", currentCard.school + " Cantrip");
    }
    else{
        templateContent = templateContent.replace("${level-school}", levelText + " Level " + currentCard.school);
    }
    
    templateContent = templateContent.replace("${title}", currentCard.title);
    templateContent = templateContent.replace("${range}", currentCard.range);
    //TODO: Radio select in GUI for components
    templateContent = templateContent.replace("${components}", currentCard.components);
    templateContent = templateContent.replace("${duration}", currentCard.duration);
    //TODO: Add option to UI for description "optimizing"
    //TODO: Add description "optimizing" function to this file -- basically, to save space, some words and phrases can be shortened ("disadvantage" to "disadv.", "Wisdom Saving Throw" to "WIS ST", etc).

    if(settings['description-optimizing'] == true){

    }

    //TODO: Add option to UI for "At Higher Levels" description. Should create a new HTML element in the card-body div
    templateContent = templateContent.replace("${description}", currentCard.description);
    templateContent = templateContent.replace("${source}", currentCard.source);

    //TODO: Create setting in UI for generating QR code if there's a link, then create a function to do that and replace "${qr_code}" with an img tag to it

    fs.writeFile('./cards/' + currentCard.title + " - " + i + ".html", templateContent, (err) =>
    {
        if(err){
            console.error("Error writing card to HTML file: ", err);
            return;
        }
    })

}

