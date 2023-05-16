/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
const dbConfig = require('./config/db')

// Read in the APL documents for use in handlers
const displaySteps = require('./template/steps.json');
const workflowList = require('./template/workflowList.json')
const launcher = require('./template/launcher.json')
const workflowItem = require('./template/workflowItem.json')

// To add steps heading
function addStep(text){
    return {
            "type": "Text",
            "id": "t1",
            "text": text,
            "fontFamily": "times new roman",
            "fontSize": "@fontSizeSmall",
            "lineHeight": "@lineHeightNormal",
            "textAlign": "left",
            "paddingLeft": "@spacingXSmall",
            "style": "textStyleDisplay3"
          };
}

// To add steps information
function addItem(text){
    return {
            "type": "Text",
            "id": "t2",
            "text": text,
            "fontFamily": "times new roman",
            "fontSize": "@fontSizeXSmall",
            "textAlign": "left",
            "paddingLeft": "@spacingLarge",
            "style": "textStyleDisplay4",
            "maxLines": 4,
            "grow": 1
          };
}

// To give space between two steps
function addDivider(){
    return {
            "type": "AlexaDivider",
            "height": "0%",
            "spacing": "@spacingSmall"
          }
}

// To add list of workflows
function addWorkflows(workflowName, synonyms){
    return {
      "type" : "AlexaTextListItem",
      "primaryText": workflowName,
      "secondaryText": "<i>Say "+synonyms[0]+" to start</i>",
      "fontSize": "@fontSizeXSmall",
      "style": "textStyleDisplay3",
      "fontFamily": "times new roman",
      "hideDivider" : true,
      "primaryAction": [
          {
            "type": "SendEvent",
            "arguments": [
              "List Item selected"
            ]
          }
        ]
    };
}

function addWorkflowItem(text){
    return {
        "type": "Text",
        "id": "helloTextComponent",
        "textAlign": "center",
        "textAlignVertical": "center",
        "paddingLeft": "@spacingSmall",
        "paddingRight": "@spacingSmall",
        "fontSize": "@fontSizeLarge",
        "style": "textStyleBody",
        "fontFamily": "times new roman",
        "text": text,
        "maxLines": 4,
        "grow": 1
    }
}

function addFooter(text){
    return {
      "type": "AlexaFooter",
      "fontFamily": "times new roman",
      "hintText": text
    }
}

function addHeader(headerTitle){
    return {
        "type": "AlexaHeader",
        "fontFamily": "times new roman",
        "fontSize": "@fontSizeXLarge",
        "headerTitle": "<b>"+headerTitle+"</b>",
        "headerDivider": true,
        "paddingBottom":"@spacingSmall",
        "headerAttributionImage": "data:image/jpeg;base64,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K9OVRJJ2OZK5FdiezX3fDt3otUrC7jmi/gT1FyfUnpMtfgtQHQBh1uPyMtESOtgqVVJPhyJqVWVPSJVhwaqd1A9SP6SC7WdkTVpC4RWB8LDa/NW0vY/mB6Ho0x1aYYFWFwdxIf8ATacVem2pcH7RYp42pCSlofnXE8Cr0zZqDeqqzA+jKCJv8H7L1qpGdTSTmWFmI6BTrfzP12nYMRwI3/RsLdG/uN55Q4C1/GwA8tT8ztIZfq/2qHffTzNd9LrLpZPv8jB2d4chUrkHdqgQDlyt8gB855xTssGU9w+RuWbVbdL2uPXWWOhRVFCqLATLLNPAUvhqNSKk1xtxbvvyMSeJqOTcW0n1lR7McExdCoWqPTyEWZRcs3MG9uR2vf4m6y3REt06caccsdiuIiJ2BERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREATFXLBWKi7WOUHYm2gmWIBFJVxPNFOp6XtfTZtNPXbeY6GIxJv8AoxdQL3BFzmIIDZrHTW4Hz0kzEAihUxJvdQPC1rZdW0y7t66fXkPRVrstTwgMtsuls3MjUkA256i552MlIgEFgRihT1uCG0D5ScoDEAkHrlHXTlNipXxIv+jU2zbc7fDpm57/AE0krEAi6NTEZjmQZeWovtod9Nd9TblfeDWxNtEW9uYHXXaofl735SUiAYMMXK+MANc7bWubHc8rTPEQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREA//2Q=="
    }
}

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        let speakOutput = 'Welcome to Kitchen Palace!!';
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']){
            handlerInput.responseBuilder.addDirective({
                type: 'Alexa.Presentation.APL.RenderDocument',
                token: "launcher",
                document: launcher
            });
        }
        else {
            speakOutput += " This example would be more interesting on a device with a screen, such as an Echo Show or Fire TV."
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const HelloWorldIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HelloWorldIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Hello World!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const GetRecipeListIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetRecipeList';
    },
    async handle(handlerInput) {
        let speakOutput = 'Displaying List of your recipes\n';
        let replaceEntityDirective;
        try{
            const data=await dbConfig.getWorkFlowList();
            // const data=await dbConfig.getWorkFlow("1");
            workflowList.mainTemplate.items[0].items[1].listItems.length=0;
            // speakOutput += data.map(x=>x.name+"\n");
            if(data){
                // for(let i=0; i<data.length; i++){
                //     workflowList.mainTemplate.items[0].items[1].listItems.push(addWorkflows(data[i].name, data[i].synonyms));
                // }
                workflowList.mainTemplate.items[0].items[1].listItems=data.map(x=>addWorkflows(x.name,x.synonyms));
                handlerInput.responseBuilder.addDirective({
                    type: 'Alexa.Presentation.APL.RenderDocument',
                    token: "workflowList",
                    document: workflowList
                });
                replaceEntityDirective = {
                  type: 'Dialog.UpdateDynamicEntities',
                  updateBehavior: 'REPLACE',
                  types: [
                    {
                      name: 'WorkflowName',
                      values: data.map(x=>{return{id:x.id,name:{value:x.name,synonyms:x.synonyms}}})
                    }
                  ]
                };
            }else{
                speakOutput = "No reciepes to display"
            }
        }
        catch(ex){
            speakOutput=JSON.stringify(ex);
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('select any one workflow')
            .addDirective(replaceEntityDirective)
            .getResponse();
    }
};

const GetRecipeItemIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetRecipeItem';
    },
    async handle(handlerInput) {
        let resolutions = handlerInput.requestEnvelope.request.intent.slots.workflowName.resolutions.resolutionsPerAuthority;
        let slotValue = resolutions.find(x=>x.values).values;
        if (slotValue) {
            slotValue = slotValue[0].value;
        }
        let speakOutput;
        try{
            //const data=await dbConfig.getWorkFlowList();
            let data=await dbConfig.getWorkFlow(slotValue.id);
            workflowItem.mainTemplate.items[0].items.length=0;
            if(data){
                data=data[0]
                console.log(data)
                speakOutput="Starting with "+data.name;
                let attr=handlerInput.attributesManager.getSessionAttributes()
                attr.steps=data.steps;
                attr.step=-1
                handlerInput.attributesManager.setSessionAttributes(attr)
                
                
                workflowItem.mainTemplate.items[0].items.push(addHeader(data.name));
                workflowItem.mainTemplate.items[0].items.push(addWorkflowItem(data.description));
                workflowItem.mainTemplate.items[0].items.push(addFooter("Say, <b>start</b> to start the workflow!"));
                handlerInput.responseBuilder.addDirective({
                    type: 'Alexa.Presentation.APL.RenderDocument',
                    token: "workflowItem",
                    document: workflowItem
                });
            }else{
                // message of workflow not found 
            }
            
        }
        catch(ex){
            speakOutput=JSON.stringify(ex);
        }
        //set session of workflow item id
        
        //const userID=handlerInput.requestEnvelope.session.user.userID;
        //const sessionID=handlerInput.requestEnvelope.session.sessionID;
        //const speakOutput = 'Hello User '+userID+' from Session '+sessionID;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('Say start the workflow')
            .getResponse();
    }
};

const GetRecipeStepsIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetRecipeStep';
    },
    handle(handlerInput) {
        let speakOutput = '';
        try{
        let resolutions = handlerInput.requestEnvelope.request.intent.slots.stepAction.resolutions.resolutionsPerAuthority;
        let stepAction = resolutions.find(x=>x.values).values;
        if (stepAction) {
            stepAction = stepAction[0].value;
        }
        let attr=handlerInput.attributesManager.getSessionAttributes()
        console.log(JSON.stringify(attr));
        const steps=attr.steps
        let stepData;
        if(stepAction.id==="start"){
            if(attr.step===-1 && steps.length>0){
                attr.step+=1
                stepData=steps[attr.step]
                displaySteps.mainTemplate.items[0].items.push(addFooter("Say,next/back or scroll up/down to navigate!"));
            }else{
                // could not start the steps again
                speakOutput = "No more steps are present. Please say next to start!!"
            }
        }else if(stepAction.id==="next"){
            if(attr.step+1<steps.length){
                attr.step+=1
                stepData=steps[attr.step]
            }else{
                // could not go beyond this step
                speakOutput = "No more steps are present. Please say back to check previous steps!!"
            }
        }else if(stepAction.id==="back"){
            if(attr.step>0){
                attr.step-=1
                stepData=steps[attr.step]
            }else{
                // could not go beyond this step
                speakOutput = "No more steps are present. Please say next to start!!"
            }
        }
        handlerInput.attributesManager.setSessionAttributes(attr)
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']){
            if(stepData){
            // speakOutput=JSON.stringify(stepData);
            var token="STEP"+attr.step;
            displaySteps.mainTemplate.items[0].items[1].items[0].items.length=0;
            displaySteps.mainTemplate.items[0].items[1].items[0].firstItem.length=0;
            displaySteps.mainTemplate.items[0].items[1].items[0].firstItem.push(addHeader("Step "+ (attr.step+1)));
            speakOutput += "Perform "+ stepData[0]["step"];
            for(let j=0; j<stepData.length;j++){
                displaySteps.mainTemplate.items[0].items[1].items[0].items.push(addStep((j+1)+". Perform : " +stepData[j]["step"]));
                if(stepData[j]["material"]){
                    displaySteps.mainTemplate.items[0].items[1].items[0].items.push(addItem("Material : "+stepData[j]["material"]));
                }
                displaySteps.mainTemplate.items[0].items[1].items[0].items.push(addDivider());
            }
            handlerInput.responseBuilder.addDirective({
                type: 'Alexa.Presentation.APL.RenderDocument',
                token: token,
                document: displaySteps
            });
        }
        }else {
            speakOutput += " This example would be more interesting on a device with a screen, such as an Echo Show or Fire TV."
        }
        }catch(ex){
            speakOutput+=JSON.stringify(ex)
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('Say next or previous to navigate')
            .getResponse();
    }
};



const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Thank You for using Kitchen Palace!!';
        
        handlerInput.responseBuilder.addDirective({
                type: 'Alexa.Presentation.APL.RenderDocument',
                token: "launcher",
                document: launcher
            });

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I don\'t know about that. Please try again.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        GetRecipeListIntentHandler,
        GetRecipeItemIntentHandler,
        GetRecipeStepsIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();