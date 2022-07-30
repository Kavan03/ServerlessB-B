import React, { useState } from 'react'
import * as AWS from 'aws-sdk'
import { ConfigurationOptions } from 'aws-sdk'
import { useEffect } from 'react'

const configuration = ConfigurationOptions = {
    region: 'us-east-1',
    secretAccessKey: '',
    accessKeyId: ''
}

AWS.config.update(configuration)
const docClient = new AWS.DynamoDB.DocumentClient()

// const fetchData=()=>{


// }
const Reviews = (props) => {
    const [reviews, setReviews] = useState([]);
    const [a, setA] = useState();
    //   const fetchDataFormDynamoDb = async () => {
    var params = {
        TableName: "feedback"
    }
    useEffect(() => {
        docClient.scan(params, function (err, data) {
            if (!err) {
                console.log(data);
                setReviews(data.Items);
                console.log(reviews);
            }
            else {
                console.log(err);
            }
        })
    }, []);



    return <>
        {/* <button onClick={() => fetchDataFormDynamoDb()}> Fetch </button> */}
        <div className="App">
            <table class="table table-bordered table-striped table-responsive-stack" id="tableOne">

                <thead>
                    <tr >
                        <th>Customers</th>
                        <th>Reviews</th>
                        <th>Ratings</th>
                    </tr>
                </thead>
                <tbody class="thead-dark">
                    {reviews.map((data, index) => {
                        return (
                            <tr key={index}>
                                <td >
                                    {data.userName}
                                </td>
                                <td >
                                    {data.description}
                                </td>
                                <td>{data.rating}</td>
                            </tr>
                        )
                    })}
                </tbody>

            </table>
        </div>
    </>

}

export default Reviews
