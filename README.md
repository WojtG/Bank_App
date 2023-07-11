<h2>Description</h2>

A demo of a bank application that allows to transfer fictional money between fictional users (to transfer "fake money" to another user, enter the user's login in the appropriate input field) and loan money from fictional bank. Application also has a function of deleting accounts.
Dates, numbers format and currencies of each account are programmed using Internalization API, also the application has a timer that automatically logs out a user if he is not using the app. Movements can be sorted according to date or in descending order.The app will be displayed when the user creates their own account or logs into one of the already created accounts from the homepage.

Homepage is created mostly by using IntersectionObserver API,that allows us to track
scroll position and react to it in a appropiete way. For most of buttons and links,
the event delegation was implemented, for the sake of better performence off the site.

<h2>Login data</h2>

Account 1
login : js password: 1111

Account 2
login : ads password: 2222

Account 3
login : kdb password: 3333

<h2> TO DO: </h2>

- work on website responsiveness
- add a button that will toggle the password visibility
- add error messages in case of wrong login data, unsuccessful transfer, wrong inputs etc
- ~~add a log out and log in buttons~~
- ~~add a create account button~~
- ~~program the landing page~~
