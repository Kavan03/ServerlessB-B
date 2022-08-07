<h1>Serverless B&B</h1>
<h3>Overview</h3>
<p>Our project is a cloud-based hotel management system built on concepts of serverless B&B and multi cloud architecture. The application contains features like selecting tour packages for customers, booking available rooms with food catering services. It also includes message passing services to enable seamless communication between customers and the hotel management. The system provides customers with online virtual support that can swiftly respond to their questions, and the application also enables message transfer capability between some permitted systems</p>
<p>The system is also equipped with chatbot feature which provides the customers with virtual assistance with anything regarding navigation of website, room availability check for the customer/guest and managing room bookings and ordering food services for authorized customers. The application will be serverless in nature to reduce development and project operating costs. The application will use cloud services from both AWS and Google Cloud Platform. We use the agile methodology to build, test, and deploy the application since it is easy to modify as the requirements change.</p>
<h3>Build With</h3>
<ul>
<li>Backend: NodeJS</li>
<li>Frontend: React</li>
<li>Services Used: Cognito and GCP Firestore were used for 3MFA user management and authentication, AWS Lambda and GCP cloud function for the backend, AWS DynamoDB and GCP firestore for storage, GCP DataStudio for visualization, GCP BigQuery ML for tour recommendations, GCP Pub-Sub for message passing and GCP CloudRun to host the application.</li>
<li>Hosted on: GCP CloudRun</li>
</ul>
<h3>Application Screenshots</h3>
<h4>Final Architecture</h4>
<img width="500" alt="login" src="https://user-images.githubusercontent.com/49091989/183277252-b595d7ba-10ff-4531-995e-0526071482ab.png">
<h4>Sinup Page</h4>
<img width="500" alt="login" src="https://user-images.githubusercontent.com/49091989/183277268-74177a8f-0687-42ea-9f7a-26d9e8a006ce.png">
<h4>Signup Page Continue</h4>
<img width="500" alt="login" src="https://user-images.githubusercontent.com/49091989/183277269-94c6c205-40ad-4e01-ae2a-645efaac3be1.png">
<h4>Registering new user</h4>
<img width="500" alt="login" src="https://user-images.githubusercontent.com/49091989/183277263-be1991dd-f819-4722-bc58-0e989417d65a.png">
<h4>Verification Link Sent</h4>
<img width="500" alt="login" src="https://user-images.githubusercontent.com/49091989/183277275-7d2655d3-d313-4679-8914-d987d499808e.png">
<h4>Mail received with verification link</h4>
<img width="500" alt="login" src="https://user-images.githubusercontent.com/49091989/183277258-9c367eea-06e0-4fd2-92d9-ace8e888fdd6.png">
<h4>Login Page</h4>
<img width="500" alt="login" src="https://user-images.githubusercontent.com/49091989/183277232-03b238c1-9fdd-467b-8523-b07f999f14e1.png">
<h4>Forgot Password</h4>
<img width="500" alt="login" src="https://user-images.githubusercontent.com/49091989/183277254-8f502f7f-0d43-439e-ad60-533d49280840.png">
<h4>Email sent with verification code<h4>
<img width="500" alt="login" src="https://user-images.githubusercontent.com/49091989/183277957-a7b7332a-e308-4b45-8d48-7b9207beb744.png">
<h4>Reset Password</h4>
<img width="500" alt="login" src="https://user-images.githubusercontent.com/49091989/183277264-63608773-dca2-4a23-b4a4-9604a7ddcca8.png">
<h4>Password Reset Successful</h4>
<img width="500" alt="login" src="https://user-images.githubusercontent.com/49091989/183277262-82178a4a-6318-452b-b33b-452857647dba.png">
<h4>Validations</h4>
<img width="500" alt="login" src="https://user-images.githubusercontent.com/49091989/183277274-0a93f146-37fd-4dfc-8c1b-913fde93092c.png">
<h4>More Validations</h4>
<img width="500" alt="login" src="https://user-images.githubusercontent.com/49091989/183277260-e69a35b9-c2a0-4b75-84f2-abec3d734eb9.png">
<h4>Second stage of multi-factor authenticaiton</h4>
<img width="500" alt="login" src="https://user-images.githubusercontent.com/49091989/183277233-d6278210-88e5-416b-9637-de7ba0dc65f8.png">
<h4>Third stage of multi-factor authenticaiton</h4>
<img width="500" alt="login" src="https://user-images.githubusercontent.com/49091989/183277234-b965a520-fe9b-4786-b61a-31be0b4d0242.png">
<h4>Home Page</h4>
<img width="500" alt="login" src="https://user-images.githubusercontent.com/49091989/183277255-32bf4281-ae4d-47d2-9f35-13d4f31027b3.jpg">
<h4>Book a room</h4>
<img width="500" alt="login" src="https://user-images.githubusercontent.com/49091989/183277236-f31fbada-bca7-46a4-8384-650391e3b0a0.png">
<h4>Successfully booked a room</h4>
<img width="500" alt="login" src="https://user-images.githubusercontent.com/49091989/183277237-538d98b7-774f-484d-b238-7de335f6fe02.png">
<h4>Order food</h4>
<img width="500" alt="login" src="https://user-images.githubusercontent.com/49091989/183277261-8333ae37-ab1b-4c63-9e3c-8233412d86b1.png">
<h4>Cancel a room booking</h4>
<img width="500" alt="login" src="https://user-images.githubusercontent.com/49091989/183277239-bb5df2bc-353f-432d-8531-e69b54f6b60a.png">
<h4>Cancel a room booking continue</h4>
<img width="500" alt="login" src="https://user-images.githubusercontent.com/49091989/183277241-29789c47-3e61-4b65-91e5-21fd9d481207.png">
<h4>Room booking cancelled successfully</h4>
<img width="500" alt="login" src="https://user-images.githubusercontent.com/49091989/183277266-fd0eeba3-daa5-4252-90f7-e16b96137ddb.png">
<h4>Search a tour</h4>
<img width="500" alt="login" src="https://user-images.githubusercontent.com/49091989/183277267-0521c9f8-7666-4ca0-81f4-442890d5cbea.png">
<h4>Tour Recommendations</h4>
!<img width="500" alt="login" src="https://user-images.githubusercontent.com/49091989/183277270-106f277e-1b1f-43ac-a5f3-a3394f1ec40c.png">
<h4>Booking a tour</h4>
<img width="500" alt="login" src="https://user-images.githubusercontent.com/49091989/183277235-3d46d891-b12c-49ec-8406-4c349aa4a68e.png">
<h4>Email confirmation sent containing tour details</h4>
<img width="500" alt="login" src="https://user-images.githubusercontent.com/49091989/183277246-63b8eaf9-9018-4be9-97df-2dc75391f62b.png">
<h4>Message passing Notifications</h4>
<img width="500" alt="login" src="https://user-images.githubusercontent.com/49091989/183277259-32e92e11-e1f0-43f8-97fa-2cde32acda70.png">
<h4>Giving a feedback</h4>
<img width="375" alt="login" src="https://user-images.githubusercontent.com/49091989/183277250-3497a61d-818f-4198-8e11-a5279f84c371.png">
<h4>Feedback continue</h4>
<img width="375" alt="login" src="https://user-images.githubusercontent.com/49091989/183277251-a72529ac-e7ce-4e1d-a7e1-6342a812f2b0.png">
<h4>Check reviews page</h4>
<img width="500" alt="login" src="https://user-images.githubusercontent.com/49091989/183277243-0cc6f2f3-a72a-400e-88cb-5145c7dc1abe.png">
<h4>Kitchen analysis visualization</h4>
<img width="500" alt="login" src="https://user-images.githubusercontent.com/49091989/183277256-f6f27805-701f-4a52-82b6-877f29d91760.png">
<h4>Room analysis visualization</h4>
<img width="500" alt="login" src="https://user-images.githubusercontent.com/49091989/183277265-cb3c9c6f-9bca-4ce2-a1a5-da8aed3c32e1.png">
<h4>User Report</h4>
<img width="500" alt="login" src="https://user-images.githubusercontent.com/49091989/183277273-8c54254e-ad74-49a0-9e94-1bf9ae5edcfd.png">
