class Message < ActiveRecord::Base
  validates_presence_of recipient_id, title, body
end
