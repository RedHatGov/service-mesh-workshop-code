# DefaultApi

All URIs are relative to *http://localhost/api/v0*

Method | HTTP request | Description
------------- | ------------- | -------------
[**boardsBoardIdGet**](DefaultApi.md#boardsBoardIdGet) | **GET** /boards/{boardId} | 
[**boardsBoardIdItemsItemIdDelete**](DefaultApi.md#boardsBoardIdItemsItemIdDelete) | **DELETE** /boards/{boardId}/items/{itemId} | 
[**boardsBoardIdItemsItemIdGet**](DefaultApi.md#boardsBoardIdItemsItemIdGet) | **GET** /boards/{boardId}/items/{itemId} | 
[**boardsBoardIdItemsPost**](DefaultApi.md#boardsBoardIdItemsPost) | **POST** /boards/{boardId}/items | 
[**boardsPost**](DefaultApi.md#boardsPost) | **POST** /boards | 


<a name="boardsBoardIdGet"></a>
# **boardsBoardIdGet**
> List&lt;Item&gt; boardsBoardIdGet(boardId)



Returns the JSON for the entire clipboard

### Example
```java
// Import classes:
//import io.swagger.client.ApiException;
//import io.swagger.client.api.DefaultApi;


DefaultApi apiInstance = new DefaultApi();
Long boardId = 789L; // Long | ID of item to fetch from the database
try {
    List<Item> result = apiInstance.boardsBoardIdGet(boardId);
    System.out.println(result);
} catch (ApiException e) {
    System.err.println("Exception when calling DefaultApi#boardsBoardIdGet");
    e.printStackTrace();
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **boardId** | **Long**| ID of item to fetch from the database |

### Return type

[**List&lt;Item&gt;**](Item.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="boardsBoardIdItemsItemIdDelete"></a>
# **boardsBoardIdItemsItemIdDelete**
> boardsBoardIdItemsItemIdDelete(boardId, itemId)



Removes the item from this board

### Example
```java
// Import classes:
//import io.swagger.client.ApiException;
//import io.swagger.client.api.DefaultApi;


DefaultApi apiInstance = new DefaultApi();
Long boardId = 789L; // Long | ID of board to delete from
Long itemId = 789L; // Long | ID of item to delete
try {
    apiInstance.boardsBoardIdItemsItemIdDelete(boardId, itemId);
} catch (ApiException e) {
    System.err.println("Exception when calling DefaultApi#boardsBoardIdItemsItemIdDelete");
    e.printStackTrace();
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **boardId** | **Long**| ID of board to delete from |
 **itemId** | **Long**| ID of item to delete |

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="boardsBoardIdItemsItemIdGet"></a>
# **boardsBoardIdItemsItemIdGet**
> Item boardsBoardIdItemsItemIdGet(boardId, itemId)



Returns the JSON for a specific item in a board

### Example
```java
// Import classes:
//import io.swagger.client.ApiException;
//import io.swagger.client.api.DefaultApi;


DefaultApi apiInstance = new DefaultApi();
Long boardId = 789L; // Long | ID of board to fetch from the database
Long itemId = 789L; // Long | ID of item to fetch from the database
try {
    Item result = apiInstance.boardsBoardIdItemsItemIdGet(boardId, itemId);
    System.out.println(result);
} catch (ApiException e) {
    System.err.println("Exception when calling DefaultApi#boardsBoardIdItemsItemIdGet");
    e.printStackTrace();
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **boardId** | **Long**| ID of board to fetch from the database |
 **itemId** | **Long**| ID of item to fetch from the database |

### Return type

[**Item**](Item.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="boardsBoardIdItemsPost"></a>
# **boardsBoardIdItemsPost**
> boardsBoardIdItemsPost(boardId)



Add an item into this board

### Example
```java
// Import classes:
//import io.swagger.client.ApiException;
//import io.swagger.client.api.DefaultApi;


DefaultApi apiInstance = new DefaultApi();
Long boardId = 789L; // Long | ID of board to add this item into
try {
    apiInstance.boardsBoardIdItemsPost(boardId);
} catch (ApiException e) {
    System.err.println("Exception when calling DefaultApi#boardsBoardIdItemsPost");
    e.printStackTrace();
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **boardId** | **Long**| ID of board to add this item into |

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="boardsPost"></a>
# **boardsPost**
> boardsPost()



Add a new board

### Example
```java
// Import classes:
//import io.swagger.client.ApiException;
//import io.swagger.client.api.DefaultApi;


DefaultApi apiInstance = new DefaultApi();
try {
    apiInstance.boardsPost();
} catch (ApiException e) {
    System.err.println("Exception when calling DefaultApi#boardsPost");
    e.printStackTrace();
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

