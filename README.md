# LogViewer

## Design

### Functional Requirements

- Data Fetching:
    - Fetch log data from the provided URL using fetch API or a similar method.
    - Handle different HTTP response statuses (e.g., success, error).
    - Fetch data in chunks rather than waiting for the entire file to download.
- Data Processing:
    - Parse fetched NDJSON data into individual JSON objects.
    - Extract the _time property from each log entry.
- Data Rendering:
    - Render the list of log entries as a table with two columns.
    - Format the _time property in ISO 8601 format (first column).
    - Display the entire event formatted as a single-line JSON string (second column).
- User Interaction:
    - Allow users to expand/collapse individual log entries.
    - The expanded view displays the complete event in multiline JSON format.
    - The collapsed view displays the single-line JSON representation.
- Visualization:
    - Users should be able to see the event counts over a period of time in a graphical format.

### Non-Functional Requirements for Log Viewer
- Performance:
    - Prioritize time-to-first-byte by rendering data as soon as it's downloaded, rather than waiting for the entire file.
    - Ensure efficient rendering for large log files to minimize performance impact.
- Usability:
    - Provide a clear and simple interface for users to view and interact with log entries.
    - Enable easy scrolling through the list of log entries.
- Accessibility:
    - Ensure the component is accessible for users with disabilities by adhering to accessibility guidelines.
- Testability:
    - Implement unit tests to cover core functionalities such as data fetching, parsing, and rendering. 
- Responsiveness
    - The application should be responsive across different device sizes.
- Error Handling
    - The application should be able to handle scenarios where the API fails without any response or returns no data at all.


### API

According to the given requirements, we need to load data immediately instead of waiting for entire file to download. There are a few ways to accomplish this :

1. HTTP Range Requests
2. Stream with the fetch API
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

    - Streamlined data flow: The Fetch API with Streams lets you process data as it arrives, reducing load time.
    - Improved user experience: Logs appear incrementally on the screen without waiting for the full file. 

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

**Solution** : We should use either HTTP Range Requests or Stream with the Fetch API for fetching data from the server. HTTP Range Requests suit the requirements better as they only load the data size requested. A hybrid approach of HTTP Range Requests and Virtual Scrolling suits the use case to get the best out of both systems. 

### Rendering Strategy - Virtual Scrolling

- There are different ways to implement Virtual Scrolling
    1. Deboucing/ Throttling

        - Advantages:

            - Provides control over when to trigger API calls as the user reaches a certain point in the UI.
            - Easier to implement

    2. Intersection observer API

        - Advantages:

            - Offers better control for triggering actions based on user position using a threshold parameter.
            - Provides better performance as it doesn't trigger reflow, making it faster than getBoundingClientRect.
        
        - Disadvantages
            - More complex to implement.


    3. getBoundingClientReact

        - Advantages:

            - Offers control over when to trigger API calls as the user reaches a certain point in the UI.
        
        - Disadvantages
            -  Fast with a smaller number of elements, but slower and may force a reflow as the number of elements increases.
            
    Given these reasons, the Intersection Observer API is a good approach for the Log Event Component.




## Usage

### Using mouse 

- Upon loading the page, a few events are loaded by default. (Added "a few") More events can be loaded by scrolling to the bottom of the page.
- The first column of the table shows the time formatted as ISO 8601. The second column displays details of the events formatted as single line JSON.
- Each event's detail can be seen by clicking on the row of the table, which shows it in detailed NDJSON format.
- Upon inspecting network logs, only one API call is made when the application is loaded. Subsequent API calls are made when scrolled to the end of the list.
- Bonus Section
    - TimeLine Component
        - The graph shows the collection of logs over time. The x-axis indicates the date and time, while the y-axis shows the number of events.
        - The width of the x-axis increases as the number of logs increases to accommodate more graphs.

### Accessibility

- The webpage is accessible compliant. 
    - The application can be used with any screen reader, which speaks aloud the chart description and table information due to defined aria labels.
    - It can also be navigated using a keyboard. Pressing the Tab key navigates through the table, with each list item selectable using the Enter key.
    - The graph has a role defined as an image to identify the SVG as an image for assistive technologies. Bars have aria labels, the chart has a title and description, and it can also be focused using the keyboard.


## Testing

### Unit tests
   
- Unit tests have been added for each component
    - LogViewer
        - Renders the table correctly 
        - Toggles row expansion to show log details
        - Shows loading indicator when fetching logs
    - TimelineChartSVG
        - Renders without crashing
        - Renders "No data to show" when there is no data
        - Renders x-axis labels correctly
        - Groups logs by date and hour correctly
        - Has accessible title and description
    - Utils/index.js
        - Checks if logs are grouped by date and hour
        - Returns empty array for empty input

- Given more time, I would have tested the application by adding more end-to-end (E2E) tests, which would give us greater confidence in the entire application. In E2E tests, I shall selenium/plaright to test the following
    - When the user scrolls, more events are loaded and the graph is updated.
    - The user can click on each row of the table to expand or collapse it.
    - Show in the network logs that an API call is made only when the end of the page is reached.
- Additionally, when a user clicks on each bar, only the events related to that timeline should be displayed. Currently, users cannot click on each bar of the graph.






