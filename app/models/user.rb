class User < ActiveRecord::Base
  acts_as_authentic
  validates_presence_of :login, :email
  validates_uniqueness_of :email
  validates_length_of :password, :minimum => 4
end

