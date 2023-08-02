ATARI

This application is designed to facilitate the search and retrieval of data on EPFL members. It provides a simple and efficient way to access relevant information about the members, such as their sciper number, gaspar username, units, etc.

Technologies Used

Front-end: The application is built using the Meteor framework and the React library as a foundation for a responsive and dynamic user interface. Reusable React components facilitate the development and maintenance of the interface, while Meteor simplifies accessing information from the backend for the frontend.

Back-end: The application's back-end is developed using the Meteor framework.

Data Sources: Information about the organization's members is retrieved from external databases, such as CADI_HELPDESK.

Security: Measures have been implemented to protect the sensitive data of the organization's members. These measures include authentication with EPFL's authentication system, Tequila, role-based authorization, and a strict policy system.

## Getting Started

If not already done, [install the Meteor command-line tool](https://docs.meteor.com/install.html). (You will only need to do this once.)

Then, run the development server:

```bash
meteor npm i
meteor
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Message for people taking over the project

This section is made for the peoples who are gonna take over the project.

Frontend:
The front-end needs to have real data into the Active Directory section.

Backend:
Before this project is production-ready, it needs to be properly connected to the tkgi-satosa cluster instead of keycloak for test and production environment.

Part of the job has already been done here: https://github.com/epfl-si/atari.ops

It also needs to have properly configured role based systeme in order to restrain access to authorized people only. The role gestion code boilerplate has already been made and is working. For more informations, please refer to this commit : https://github.com/epfl-si/ATARI/commit/880f58f5e202249be6b620e326ac100ddfd99f33
