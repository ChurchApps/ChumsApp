# CHUMS
**CHU**rch **M**anagement **S**oftware

Visit <a href="https://chums.org/">https://chums.org/</a> to learn more.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
#### Join us on [Slack](https://join.slack.com/t/livechurchsolutions/shared_invite/zt-i88etpo5-ZZhYsQwQLVclW12DKtVflg).

### Depends on
* [AccessApi](https://github.com/LiveChurchSolutions/AccessApi)
* [AttendanceApi](https://github.com/LiveChurchSolutions/AttendanceApi)
* [GivingApi](https://github.com/LiveChurchSolutions/GivingApi)
* [MembershipApi](https://github.com/LiveChurchSolutions/MembershipApi)

### Dev Setup Instructions
For the APIs, you may either set them up on your local machine first, or point to the staging server copies during development.  The staging server urls are in the sample dotenv files.

#### ChumsApp 
1. Copy `dotenv.sample.txt` to `.env` and updated it to point to the appropriate API urls. 
2. Pull the [appBase](https://github.com/LiveChurchSolutions/AppBase) submodule with: `git submodule init && git submodule update`
3. Install the dependencies with: `npm install`
4. run `npm start` to launch the project.



[![ChumsApp Dev Setup](https://img.youtube.com/vi/5zsEJEp6yMw/0.jpg)](https://www.youtube.com/watch?v=5zsEJEp6yMw)
