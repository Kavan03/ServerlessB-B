const language = require('@google-cloud/language');

const client = new language.LanguageServiceClient();

// Text for sentiment analysis
const positiveText = "I am incredibly happy today! It may be the best day ever!"
const negativeText = "Oh no, it's Monday. My alarm didn't go off! I have a presentation in a few minutes. This is really bad."

// Format for Cloud Natural Language API
const positiveDocument = {
    type: 'PLAIN_TEXT',
    content: positiveText,
  };
  
  const negativeDocument = {
    type: 'PLAIN_TEXT',
    content: negativeText,
  };

  (async () => {
    const positiveResults = await client.analyzeSentiment({ document: positiveDocument });
    const negativeResults = await client.analyzeSentiment({ document: negativeDocument });
    console.log(positiveResults);
    console.log(negativeResults);
  })();