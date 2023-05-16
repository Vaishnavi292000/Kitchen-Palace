# Kitchen-Palace

This is a small demonstration of Alexa with [APL](https://developer.amazon.com/en-US/docs/alexa/alexa-presentation-language/add-visuals-and-audio-to-your-skill.html) features. In this project you will have different screens which can be handled by voice commands. You can run this in your alexa Echo Show or Fire TV's. This project include data extracting from database and displaying it on UI with [ListView](https://developer.amazon.com/ja-JP/docs/alexa/alexa-presentation-language/apl-alexa-text-list-item-layout.html) and [ScrollView](https://developer.amazon.com/en-US/docs/alexa/alexa-presentation-language/apl-scrollview.html)

## What You Will Need
*  [Amazon Developer Account](http://developer.amazon.com/alexa)
*  [Amazon Web Services Account](http://aws.amazon.com/)
*  The sample code on [GitHub](https://github.com/Vaishnavi292000/Kitchen-Palace).

## Contents of Repo
This folder contains the following:

1. JSON of interaction model which you can directly copy and paste in your skill.
2. Lambda code or skill code to populate the screens and data on it.
3. Database files

<b> Demo video is attached to see how to run this skill on your own. </b>

## Changes needs to be done
1. Open dynamoDb of your skill and copy the table name.
2. Paste the table in your Lambda/skill code-> config -> db.js -> line No. 3
3. Paste the db_items.json file in your table items.

## References
- [Dynamic Entities Tech Docs](https://developer.amazon.com/docs/custom-skills/use-dynamic-entities-for-customized-interactions.html)
- [SessionAttributes](https://developer.amazon.com/docs/custom-skills/manage-skill-session-and-session-attributes.html)
