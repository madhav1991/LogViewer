# LogViewer

## Design

### Functional Requirements

- Data Fetching:
    - Fetch log data from the provided URL using fetch API or a similar method.
    - Handle different HTTP response statuses (e.g., success, error).
- Data Processing:
    - Parse fetched NDJSON data into individual JSON objects.
    - Extract _time property from each log entry.
- Data Rendering:
    - Render the list of log entries as a table with two columns.
    - Format the _time property in ISO 8601 format (first column).
    - Display the entire event formatted as a single-line JSON string (second column).
- User Interaction:
    - Allow users to expand/collapse individual log entries.
    - Expanded view displays the complete event in multiline JSON format.
    - Collapsed view displays the single-line JSON representation.


### Non-Functional Requirements for Log Viewer
- Performance:
    - Prioritize time-to-first-byte by rendering data as soon as it's downloaded, not waiting for the entire file.
    - Ensure efficient rendering for large log files to minimize performance impact.
- Usability:
    - Provide a clear and simple interface for users to view and interact with log entries.
    - Enable easy scrolling through the list of log entries.
- Accessibility:
    - Ensure the component is accessible for users with disabilities by adhering to accessibility guidelines.
- Testability:
    - Implement unit tests to cover core functionalities like data fetching, parsing, and rendering.

### API

According to the given requirements, we need to load data immediately instead of waiting for entire file to download. There are few ways to accomplish this

1. HTTP Range Requests
2. Stream with fetch API
3. Infinite scrolling

1) HTTP Range Requests


- Advantages 
    - Efficient data transfer: Allows fetching only the necessary parts of the file, reducing bandwidth usage.
    - Partial download: Users can start seeing log entries without downloading the entire file.
    - Seamless continuation: If the user scrolls or requests more data, additional ranges can be fetched on demand.
- Disadvantages
    - Requires server support: Not all servers might support range requests, so this may require configuration or adjustments on the server side.

- Best for: Reducing data transfer and network overhead if the server supports it

2) Stream with fetch API

- Advantages:

    - Streamlined data flow: Fetch API with Streams lets you process data as it arrives, reducing load time.
    - Improved user experience: Logs appear incrementally on the screen, without waiting for the full file.

- Disadvantages:

    - Potentially more data fetched: Since data is streamed in chunks, you may end up downloading more than the user views, especially if they don't scroll through the entire file.

- Best for: Real-time incremental data processing

3) Infinite scrolling

- Advantages:

    - Optimized UI performance: Only the visible portion of the log entries is rendered, which minimizes memory usage and prevents the browser from lagging with large datasets.
    - Great user experience: Virtual scrolling can handle even extremely large lists (e.g., hundreds of thousands of log entries) smoothly.

- Disadvantages:

    - Doesn't solve data fetching by itself: Virtual scrolling focuses on rendering efficiency, not how to fetch the data, so it should be used in conjunction with one of the other methods.
    - UI might be complex: If you need features like expanding individual log entries or detailed views, virtual scrolling can make the UI logic more complex.

- Best for: Efficient UI rendering and memory usage

**Solution** : It is we need to use HTTP Range Requests or Stream with fetch API for fetching data from server. HTTP Range Requests suits the requirements better as it only loads the data size we request. A hybrid approach of HTTP Range Requests and Virtual Scrolling suits the use case to get the best out of both systems. 

### Rendering Strategy - Virtual Scrolling

- There are different ways to implement Virtual Scrolling
    1. Deboucing/ Throttling

        - Advantages:

            - Gives control when to trigger api call when user reaches a point in the UI
            - Easier to implement

    2. Intersection observer API

        - Advantages:

            - Better control to trigger w.r.t user position using threshold paramter
            - Better performance as it doesn't trigger reflow , hence faster than getBoundingClientReact
        
        - Disadvantages
            - Not easy to implement


    3. getBoundingClientReact

        - Advantages:

            - Gives control when to trigger api call when user reaches a point in the UI
        
        - Disadvantages
            -  It is fast when there are smaller number of elements, but will be slower and forcing a reflow when number of elements rise.  
            
    Due to above mentioned reasons, Interesection observer API is a good aproach for the Log Event Component




## Usage

### Using mouse 

- Upon loading the page, by deafult few events are loaded. More events can be loaded by scrolling to the bottom of the page
- The left side of the table shows the time formatted as ISO 8601.The right side of table shows details of events.
- Each event detail can be seen by clicking on the row of the table, which shows in detailed NDJSON format
- On inspection of network logs, by default when the application is loaded only one API call is made. When scrolled to the end of list, subsequent api calls are made. 

### Accessibility

- The webpage is accessible compliant. 
    - The application can be used by any screen reader which speaks aloud chart description and table information due to aria labels defined.
    - It can be used by keybaord too using the tab button. On click of tab, the cursor naviagtes through the table through each list which can be clicked using the enter button.



## Testing

### Unit tests
   
- Unit tests have been added for each component
    - LogViewer
        - Renders the table correctly 
        - Fetches and displays the logs correctly
        - Toggles row expansion to show log details
        - Fetches more logs when scrolled to the end of list
    - TimeLineChart
        - Renders the chart and initializes with correct options
        - Updates chart when the prop changes

- Given more time, I would have tested the application by adding more E2E tests which gives us more confidence on the entire application.




