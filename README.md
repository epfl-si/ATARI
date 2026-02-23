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

## Development

### Prep Work

1. Copy `settings-mock.json` to `settings.json`, or, if your access rights permit it,
copy `/keybase/team/epfl_atari/settings-dev.json` to `settings.json`
2. Optionnaly, edit `settings.json`
3. ```bash
   meteor npm install
   ```
  💡 Do the latter again whenever `package.json` changes (e.g. when switching Git branches)

### Day-to-day development

If you need to bypass the official authentification system with a local one, start firstly:

```bash
docker compose up
```

Start the application with:

```bash
meteor --settings settings.json
```

and direct your browser to http://localhost:3000/

Meteor features hot code reload for both client and server, so that you can start editing the source code and (most of the time) see the changes happen immediately.

## Tech stack and environment

**Front-end**: The application is built using the Meteor framework and the React
library as a foundation for a responsive and dynamic user interface. Reusable
React components facilitate the development and maintenance of the interface,
while Meteor simplifies accessing information from the backend for the frontend.

**Back-end**: The application's back-end is developed using the Meteor framework.

**Data sources**: Information about the organization's members is retreived from
https://api.epfl.ch, but also from the AD.

**Security**: Measures have been implemented to protect the sensitive
data of the organization's members. These measures include
authentication with EPFL's Web-based Single Sign-on (SSO) system;
role-based authorization; and a strict policy system. The group
`ATARI-access` is used to grants access to the application.

## Deployment (prod)

See https://github.com/epfl-si/ATARI.ops
