
package com.redhat.dudash.candv.beans;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyDescription;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "timestamp",
    "raw"
})
public class Item {

    /**
     * A timestamp of when the item was put in the clipboard as ISO 8601 e.g.: 2014-09-08T08:02:17-05:00
     * 
     */
    @JsonProperty("timestamp")
    @JsonPropertyDescription("A timestamp of when the item was put in the clipboard as ISO 8601 e.g.: 2014-09-08T08:02:17-05:00")
    private String timestamp;
    /**
     * The raw string of the item on the clipboard
     * 
     */
    @JsonProperty("raw")
    @JsonPropertyDescription("The raw string of the item on the clipboard")
    private String raw;

    /**
     * A timestamp of when the item was put in the clipboard as ISO 8601 e.g.: 2014-09-08T08:02:17-05:00
     * 
     */
    @JsonProperty("timestamp")
    public String getTimestamp() {
        return timestamp;
    }

    /**
     * A timestamp of when the item was put in the clipboard as ISO 8601 e.g.: 2014-09-08T08:02:17-05:00
     * 
     */
    @JsonProperty("timestamp")
    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    /**
     * The raw string of the item on the clipboard
     * 
     */
    @JsonProperty("raw")
    public String getRaw() {
        return raw;
    }

    /**
     * The raw string of the item on the clipboard
     * 
     */
    @JsonProperty("raw")
    public void setRaw(String raw) {
        this.raw = raw;
    }

}
