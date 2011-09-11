class User < ActiveRecord::Base
  acts_as_authentic
  
  has_many :posts
  has_many :followings
  has_many :messages
  
  validates_presence_of :login
  validates_uniqueness_of :email
end

