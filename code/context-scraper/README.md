# CONTEXT-SCRAPER
## Automatic digging through items to find contextual matches 
This microservice provides the ability to analyze the board items to find contextual matches. These contextual matches can be other board items or things scraped from trusted internet sources. For v1 we will be using the Google [Custom Search API][1] as our engine to scrape the web. 

Here is the engine - it's currently capped on my account at 10,000 queries/day please don't abuse it. 

*PLEASE - if you run this at scale switch out the engine ID*

GUI based test here: [https://cse.google.com/cse?cx=005627457786250373845:lwanzyzfwji][3]

Unrestricted testing URL: ```http GET https://www.googleapis.com/customsearch/v1/ key==AIzaSyDRdgirA2Pakl4PMi7t-8LFfnnjEFHnbY4 cx==005627457786250373845:lwanzyzfwji q==microservices```

Restricted testing URL: ```http GET https://www.googleapis.com/customsearch/v1/siterestrict key==AIzaSyDRdgirA2Pakl4PMi7t-8LFfnnjEFHnbY4 cx==005627457786250373845:lwanzyzfwji q==microservices```

## API Documentation
- GET /scrape/custom_search?term==YOUR_TERM_HERE

example return JSON data is an array of:
```
{
    "link": "https://www.reddit.com/r/gaming/comments/anwgxf/here_is_an_example_of_old_graphics_on_crt_vs/",
    "snippet": "Feb 6, 2019 ... Here is an example of old graphics on CRT, vs. modern emulation. On the CRT \nthey look more detailed as your brain fills in the blurred gaps.",
    "thumbnail": [
        {
            "height": "162",
            "src": "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRy33fwR5E7lfc6OTSvfTXyWZZuQui4P_2GeNY8dXOICCp6w3TwEQNDUzg",
            "width": "310"
        }
    ],
    "title": "Here is an example of old graphics on CRT, vs. modern emulation ..."
}
```
Note: thumbnail is not always included.


## Developer instructions

### Env Vars
- GOOGLE_APIS_URL - URL to ping for google search (defaults to: `https://www.googleapis.com/customsearch/v1/siterestrict`)
- GOOGLE_API_KEY - API key to use for google (defaults to mine)
- GOOGLE_CX - cx parameter for the google search (defaults to mine)
- SERVICE_NAME - so you can rename the service 
- DEBUG_STACK_TRACE - set to `true` to dump 404 and 500 error stacks
- DEBUG_FORCED_CONTEXT_VALUE - set to force the context scraping to a fixed value
- DEBUG - specify the debug loggers to print out (use a comma separated list)

### Local Installation / Run / Test
```bash
$ npm install
```

Start the service:
```bash
$ npm run-script dev
```
In another terminal you can test with:
```bash
$ http GET localhost:8080/scrape/custom_search?term==YOUR_TERM_HERE
```

### Running on OpenShift
```bash
TBD
```

### Developer Tips
For more info on using request-promises [check this out](https://github.com/request/request-promise)

[1]: https://developers.google.com/custom-search/v1/overview
[2]: https://httpie.org/
[3]: https://cse.google.com/cse?cx=005627457786250373845:lwanzyzfwji