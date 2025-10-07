
const generateCardButton = document.getElementById('generateCard')

class spellCard {
  constructor(title, level, school, range, components, duration, description, source, link) {
    this.title = title;
    this.level = level;
    this.range = range;
    this.school = school;
    this.components = components;
    this.duration = duration;
    this.description = description;
    this.source = source;
    this.link = link;
  }

  createCard(){
    var currentCard = this;

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
    //TODO: Radio select in GUI for components
    templateContent = templateContent.replace("${components}", currentCard.components);
    templateContent = templateContent.replace("${duration}", currentCard.duration);
    //TODO: Add option to UI for description "optimizing"
    //TODO: Add description "optimizing" function to this file -- basically, to save space, some words and phrases can be shortened ("disadvantage" to "disadv.", "Wisdom Saving Throw" to "WIS ST", etc).

    if(settings['description-optimizing'] == true){

    }

    //TODO: Add handling for if a spell's range is Touch
    if(currentCard.range = 'touch'){
      templateContent = templateContent.replace("${range}", "Touch");
    }
    else{
      templateContent = templateContent.replace("${range}", currentCard.range + " ft");
    }
    
    //TODO: Add option to UI for "At Higher Levels" description. Should create a new HTML element in the card-body div
    templateContent = templateContent.replace("${description}", currentCard.description);
    templateContent = templateContent.replace("${source}", currentCard.source);

    //TODO: Create setting in UI for generating QR code if there's a link, then create a function to do that and replace "${qr_code}" with an img tag to it

    fs.writeFile('./cards/' + currentCard.title + ".html", templateContent, (err) =>
    {
        if(err){
            console.error("Error writing card to HTML file: ", err);
            return;
        }
    })

    fs.closeSync();
}

}

generateCardButton.addEventListener('click', () => {
  alert("Pressed");

  var level = document.getElementById('level').value;
  var title = document.getElementById('name').value;
  var school = document.getElementById('school').value;
  var range = document.getElementById('range').value; 
  var components =  [document.getElementById('verbal').value, document.getElementById('somatic').value, document.getElementById('mat-components').value];
  var duration = document.getElementById('duration').value;
  var description = document.getElementById('description').value;
  var source = document.getElementById('source').value;
  var link = document.getElementById('link').value;

  alert("CREATING CARD");

  card = new spellCard(title, level, school, range, components, duration, description, source, link);
  card.createCard();

  alert("CARD CREATED");
})