# ATARI

ATARI stands for **A**nnuaire **T**echnique d’**A**ttributs pour
**R**esponsables **I**nformatiques which can be translated to Technical
Directory of Attributes for IT Managers.

It's an enhanced directory with technical attributes intended for individuals 
with IT roles at EPFL (IT admins, IT managers, etc.). ATARI provides a simple 
and efficient way to access relevant information about EPFL members, such as 
sciper number, gaspar username, units, etc.

ATARI can be accessed at https://atari.epfl.ch within EPFL by individuals with 
the appropriate access rights.

## Tech stack and environment

**Front-end**: The application is built using the Meteor framework and the React
library as a foundation for a responsive and dynamic user interface. Reusable
React components facilitate the development and maintenance of the interface,
while Meteor simplifies accessing information from the backend for the frontend.

**Back-end**: The application's back-end is developed using the Meteor framework.

**Data sources**: Information about the organization's members is retreived from
https://api.epfl.ch, but also from the AD.

**Security**: Measures have been implemented to protect the sensitive data of
the organization's members. These measures include authentication with EPFL's
authentication system, Tequila, role-based authorization, and a strict policy
system. The group `ATARI-access` is used to grants access to the application.

## Getting Started (development)

First of all, clone the repository on your own device.

Then, rename the `settings-mock.json` file in `settings.json` and replace the
data with your own data.

If not already done, [install the Meteor command-line tool](https://docs.meteor.com/install.html)
and [Docker](https://docker.com) (You will only need to do this once.)

Install the necessary dependancies of this project using Meteor:
```sh
meteor npm i
```

Then, you can run the integrality of the project just by using one make command:
```sh
make all
```
*The app is auto-refreshing whenever you save a file while coding, no need to 
restart the application.*

To have a deeper understanding about how the project is started, you can have a
look at the [Makefile](Makefile).

Wait a bit and open [http://localhost:3000](http://localhost:3000) with your
browser to see the result.

## Deployment (prod)

The code to deploy this app is hosted on the https://github.com/epfl-si/ATARI.ops 
directory. The deployment uses [Ansible] wrapped in a convenient [suitcase], 
called [`atarisible`].

[Ansible]: https://www.ansible.com (Ansible is Simple IT Automation)
[suitcase]: https://github.com/epfl-si/ansible.suitcase (Install Ansible and its dependency stack into a temporary directory)
[`atarisible`]: https://github.com/epfl-si/atari.ops/blob/main/atarisible
