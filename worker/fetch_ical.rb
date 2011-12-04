require 'rubygems'
require 'icalendar'
require 'date'
require 'mongo'
require 'hmac-md5'

ical_name = ARGV[0]

cal_file = File.open("#{ical_name}.ical")
cals = Icalendar.parse(cal_file)

db = Mongo::Connection.new("localhost", 27017).db("localized-charity-events-aggregator-dev")
coll = db.collection('events')

cals.each do |cal|
  cal.events.each do |event|
    puts event.dtstart
    puts event.summary
    # md5_hash = HMAC::MD5.new("#{event.dtstart}#{event.summary}#{ical_name}").hexdigest
    md5_hash = "#{event.dtstart}#{event.summary}#{ical_name}"
  
    event_entry = coll.find_one("event_hash" => md5_hash)
  
    if event_entry == nil
      new_event = {'title' => event.summary, 'startDate' => event.dtstart.to_s, 'event_hash' => md5_hash}
      coll.insert(new_event)
    # else
      # puts event_entry
    end
  end
end
