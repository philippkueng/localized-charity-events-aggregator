# localized charity events aggregator

## What is it about?

Developing a scraping API to gather volunteer opportunities worldwide from NGO websites.

The aggregator aims at providing the opportunities in a clean and consistent way to facilitate volunteer finding and in the end increase the number of people volunteering.

A number of organizations and initiatives are already providing such data, however the current work plan is to distribute our functionality to help organizations in other countries or cities scraping data themselves from their local organizations. This will benefit local organizations in need of volunteers as it will facilitate inhabitants to learn about volunteer opportunities.

The service developed in this work is more important that the content itself.

**Background**

This project was initiated at [RHoK Switzerland](http://www.rhok.org/event/zurich-switzerland) between December the 3rd and 4th by [@ikr](http://twitter.com/ikr), [@bennyschudel](http://twitter.com/bennyschudel), [@henrik_ch](http://twitter.com/henrik_ch), Olivier Piron, Simon Hefti and [@philippkueng](http://twitter.com/philippkueng).

**Additional Resources**

[Problem Definition on rhok.org](http://www.rhok.org/problems/aggregator-communitycharity-events-based-locality)
[Our proposed solution to the problem](http://www.rhok.org/solutions/charity-event-aggregator)
[Slides used for presenting the project](https://docs.google.com/present/edit?id=0Ac1CjBkan4BTZDRoMjUzZF8xNWRyZ254Z2hu)

## Setup

In order to run an instance yourself we recommend getting a VPS instance with Ubuntu 10.04 LTS installed on it. Then ssh into the instance and issue the following commands to setup the system.

Installing Node.js and Dependencies

    $ sudo apt-get update
    $ sudo apt-get upgrade -y
    $ sudo apt-get install g++ gcc openssl libssl-dev git-core vim -y
    $ git clone git://github.com/joyent/node.git
    $ cd node/
    $ git checkout v0.6.4
    $ ./configure
    $ sudo make
    $ sudo make install
    $ cd ..
    $ git clone git://github.com/isaacs/npm.git
    $ cd npm/
    $ sudo make install
    $ sudo npm install railway -g
    
Install MongoDB

    $ sudo vim /etc/apt/sources.list
    -> insert `deb http://downloads-distro.mongodb.org/repo/debian-sysvinit dist 10gen` at the top and save with :wq
    $ sudo apt-key adv --keyserver keyserver.ubuntu.com --recv 7F0CEB10
    $ sudo apt-get update
    $ sudo apt-get install mongodb-10gen
    
Install Ruby and Dependencies

    $ bash < <(curl -s https://raw.github.com/wayneeseguin/rvm/master/binscripts/rvm-installer )
    $ rvm install 1.9.2
    $ rvm use 1.9.2
    $ gem install ruby-hmac
    $ gem install icalendar
    
Copy actual project code

    $ git clone git://github.com/philippkueng/localized-charity-events-aggregator.git
    $ cd ...
    $ npm install -l
    $ railway server
    

## License

This project is licensed under the [CC BY-SA 3.0 - CreativeCommons Attribution-ShareAlike 3.0 License](http://creativecommons.org/licenses/by-sa/3.0/)