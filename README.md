# Assignment 5 Redis  

## DESCRIPTION

Create a Website that display data and data fetch time from one or two of these Rest API end points.(Simplest possible display of data, doesn't need to be a good user interface, just functional enough to see that the data was fetched, AND how long it took to fetch.)



https://datausa.io/api/data?University=142832&measures=Total%20Noninstructional%20Employees&drilldowns=IPEDS%20Occupation&parents=true
https://datausa.io/api/data?measures=Average%20Wage,Average%20Wage%20Appx%20MOE&drilldowns=Detailed%20Occupation
Requirements for project:



Use Redis to enhance secondary respond times from these end points.
Make use Redis to drill down in to the data and find some interesting point that can be fetched and displayed without the need to re-query the API all the time.
Divide the data in to logical divisions using either sets, lists,hashed or one of the other types native to Redis.
Specify a retention time for all values (Time to live)

## SOLUTION:

#### This project build up on the previous - MongoDB- assignment
### Run Redis server instance locally on the default port
### Clone this repo
### cd to server, run npm install and then npm start
### cd to client, run npm install and then npm start
### Go to http://localhost:3000/redis and play with it. There are also answers to the questions asked.
