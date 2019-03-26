# CONTEXT-SCRAPER
## Automatic digging through items to find contextual matches 
This microservice provides the ability to analyze the board items to find contextual matches. These contextual matches can be other board items or things scraped from trusted internet sources. For v1 we will be using the Google [Custom Search API][1] as our engine to scrape the web. 

Here is the engine - it's currently capped on my account at 10,000 queries/day please don't abuse it. 

*PLEASE - if you run this at scale switch out the engine ID*

GUI based test here: [https://cse.google.com/cse?cx=005627457786250373845:lwanzyzfwji][3]

Unrestricted testing URL: ```http GET https://www.googleapis.com/customsearch/v1/ key==AIzaSyDRdgirA2Pakl4PMi7t-8LFfnnjEFHnbY4 cx==005627457786250373845:lwanzyzfwji q==microservices```

Restricted testing URL: ```http GET https://www.googleapis.com/customsearch/v1/siterestrict key==AIzaSyDRdgirA2Pakl4PMi7t-8LFfnnjEFHnbY4 cx==005627457786250373845:lwanzyzfwji q==microservices```

## API Documentation
TBD


## Development instructions

### Env Vars
* CSE_API_KEY - API key to use for google (defaults to mine: `AIzaSyDRdgirA2Pakl4PMi7t-8LFfnnjEFHnbY4`)
* CSE_ENGINE_ID - cx parameter for the google search (defaults to mine: `005627457786250373845:lwanzyzfwji`)

### Local Installation / Run / Test
```bash
$ npm install
```

#### Running the app locally
```bash
$ npm start
```

### Running on OpenShift
```bash
TBD
```

[1]: https://developers.google.com/custom-search/v1/overview
[2]: https://httpie.org/
[3]: https://cse.google.com/cse?cx=005627457786250373845:lwanzyzfwji