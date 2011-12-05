require 'rubygems'
require 'icalendar'
require 'date'
require 'time'
require 'mongo'
require 'hmac-md5'

ical_name = ARGV[0]

cal_file = File.open("#{ical_name}.ical")
cals = Icalendar.parse(cal_file)

db = Mongo::Connection.new("localhost", 27017).db("localized-charity-events-aggregator-dev")
coll = db.collection('events')

cals.each do |cal|
  cal.events.each do |event|
    
    # create a unique hash based to prevent duplicate entries
    s = "#{event.dtstart.to_s}#{event.summary}#{ical_name}"
    hash = HMAC::MD5.new "secret"
    hash.update s
    
    # find single entry with matching hash
    event_entry = coll.find_one("event_hash" => hash.to_s)
  
    if event_entry == nil # no entry with this hash was found
      new_event = {'title' => event.summary, 'startDate' => Time.parse(event.dtstart.to_s), 'event_hash' => hash.to_s}
      coll.insert(new_event)
    end
    
    puts "#{ical_name}.ical synced."
  end
end
